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
  let inner = (
    <>
      <b>
        <HighlightElm text={label} searchTerm={searchTerm} />
      </b>{" "}
      <small>
        <HighlightElm text={id} searchTerm={searchTerm} />
      </small>
    </>
  );

  if (onlyShowLabel) {
    if (label) {
      inner = (
        <>
          <b>
            <HighlightElm text={label} searchTerm={searchTerm} />
          </b>{" "}
        </>
      );
    } else {
      inner = (
        <>
          <small>
            <HighlightElm text={id} searchTerm={searchTerm} />
          </small>
        </>
      );
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
