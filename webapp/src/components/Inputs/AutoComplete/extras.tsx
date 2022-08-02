import "./extras.css";
import { FC } from "react";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

export const HighlightElm: FC<{
  text: string;
  searchTerm: string;
}> = ({ text, searchTerm }) => {
  const matches = match(text, searchTerm, {
    findAllOccurrences: true,
    insideWords: true,
  });
  const parts = parse(text, matches);
  return (
    <>
      {parts.map((part, index) => (
        <span
          key={index}
          style={{
            textDecoration: part.highlight ? "underline" : "unset",
          }}
        >
          {part.text}
        </span>
      ))}
    </>
  );
};

export const SearchItem: FC<{
  listProps: React.HTMLAttributes<HTMLLIElement>;
  label: string;
  id: string;
  searchTerm: string;
  onlyShowLabel?: boolean;
}> = ({ listProps, label, id, searchTerm, onlyShowLabel = false }) => {
  const labelElm = (
    <b className="input-extras--search-item--list--label">
      <HighlightElm text={label} searchTerm={searchTerm} />
    </b>
  );
  const idElm = (
    <small className="input-extras--search-item--list--id">
      <HighlightElm text={id} searchTerm={searchTerm} />
    </small>
  );

  let inner = (
    <>
      {labelElm}
      {idElm}
    </>
  );

  if (onlyShowLabel) {
    if (label) {
      inner = labelElm;
    } else {
      inner = idElm;
    }
  }

  return (
    <li
      {...listProps}
      className={[
        listProps.className ?? "",
        "input-extras--search-item--list",
      ].join(" ")}
    >
      {inner}
    </li>
  );
};
