import { highlight, languages } from "prismjs";
import "prismjs/components/prism-haskell";
import "prismjs/components/prism-typescript";
import * as React from "react";
import { classNames } from "../utils";

const Code: React.FC<{
  code: string;
  language: string;
  className?: string;
}> = ({ code, language = "javascript", className }) => {
  const languageL = language.toLowerCase();
  const prismLanguage = languages[languageL];
  return (
    <div className={classNames("text-sm", className)}>
      <pre
        className={`text-gray-300 rounded-md p-2 md:p-4 leading-5 language-${language
          .replace(" ", "")
          .toLowerCase()}`}
      >
        {prismLanguage !== undefined ? (
          <code
            dangerouslySetInnerHTML={{
              __html: highlight(code, prismLanguage, language)
            }}
          />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
};

export default Code;
