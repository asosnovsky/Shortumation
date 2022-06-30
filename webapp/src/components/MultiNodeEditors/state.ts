import { MultiNodeEditorProps } from "./types";
import { useState, useRef } from "react";
import { AutomationNode } from "../../types/automations/index";
import { makeDefault } from "utils/automations";
import { useConfirm, ConfirmOptions } from "material-ui-confirm";
import { useSnackbar } from "notistack";

export type MultiNodeEditorInternalState = {
  slides: AutomationNode[];
  slide: number;
  multiNode: {
    isModified: boolean;
    isSaved: boolean;
  };
  internalNodeModified: boolean;
};

export const useMultiNodeEditorState = (props: MultiNodeEditorProps) => {
  // state
  const confirm = useConfirm();
  const snackbr = useSnackbar();
  const [state, _setState] = useState(
    makeInitialState({
      slides: props.sequence,
    })
  );
  const justSaved = useRef(false);

  //   alias
  const { slide, slides, multiNode, internalNodeModified } = state;
  const setState = (a: MultiNodeEditorInternalState) => {
    _setState(a);
  };
  const askThenDo = async (
    options: ConfirmOptions,
    action: () => void,
    condition = () => internalNodeModified && !multiNode.isSaved
  ) => {
    if (condition()) {
      return await confirm(options)
        .then(action)
        .catch(() => {
          snackbr.enqueueSnackbar("Cancelling...", {
            variant: "info",
          });
        });
    } else {
      return action();
    }
  };

  return {
    get totalSlides() {
      return slides.length;
    },
    get currentSlideNumber() {
      return slide;
    },
    get currentSlide() {
      return slides[slide];
    },
    get isLast() {
      return slide >= slides.length - 1;
    },
    get isEmpty() {
      return slides.length === 0;
    },
    get isModified() {
      return (
        (internalNodeModified || multiNode.isModified) && !multiNode.isSaved
      );
    },
    moveBack() {
      if (slide <= 0) {
        return;
      }
      return askThenDo(
        {
          description:
            "Moving back without saving will cause you to lose the work, are you sure you want to do that?",
        },
        () =>
          setState({
            ...state,
            slide: slide - 1,
            internalNodeModified: false,
          })
      );
    },
    moveForward() {
      const createNew = slide >= slides.length - 1;
      const action = createNew ? "Creating a new new node" : "Moving forward";
      return askThenDo(
        {
          description: `${action} without saving will cause you to lose the work, are you sure you want to do that?`,
        },
        () => {
          if (createNew) {
            setState({
              ...state,
              slide: slides.length,
              slides: slides.concat([makeDefault(props.allowedTypes[0])]),
              internalNodeModified: false,
              multiNode: {
                isModified: true,
                isSaved: false,
              },
            });
          } else {
            setState({
              ...state,
              slide: slide + 1,
              internalNodeModified: false,
            });
          }
        }
      );
    },
    updateInternalNode(isReady: boolean, isModified: boolean) {
      if (!isReady || isModified) {
        if (!state.multiNode.isModified || state.multiNode.isSaved) {
          if (justSaved.current) {
            justSaved.current = false;
          } else {
            setState({
              ...state,
              multiNode: { isModified: true, isSaved: false },
              internalNodeModified: true,
            });
          }
        }
      }
    },
    onRemove() {
      setState({
        ...state,
        slide: Math.max(slide - 1, 0),
        slides: slides.slice(0, slide).concat(slides.slice(slide + 1)),
        multiNode: {
          isModified: true,
          isSaved: false,
        },
      });
    },
    onSave(node: AutomationNode) {
      justSaved.current = true;
      setState({
        ...state,
        slides: slides
          .slice(0, slide)
          .concat([node])
          .concat(slides.slice(slide + 1)),
        multiNode: {
          isModified: multiNode.isModified,
          isSaved: true,
        },
        internalNodeModified: false,
      });
    },
    onSaveEmpty() {
      justSaved.current = true;
      setState({
        ...state,
        multiNode: {
          isModified: multiNode.isModified,
          isSaved: true,
        },
        internalNodeModified: false,
      });
    },
    async onClose() {
      if (!multiNode.isSaved && multiNode.isModified) {
        try {
          await confirm({
            description:
              "You haven't saved your work, are you ok with losing it?",
          });
          props.onSave && props.onSave(slides);
        } catch (_: any) {
          return;
        }
      }
      if (justSaved.current) {
        props.onSave && props.onSave(slides);
      }
      props.onClose && props.onClose();
    },
  };
};

const makeInitialState = (
  props: Partial<MultiNodeEditorInternalState>
): MultiNodeEditorInternalState => ({
  slides: [],
  slide: 0,
  multiNode: {
    isModified: false,
    isSaved: false,
  },
  internalNodeModified: false,
  ...props,
});
