import { highlight, languages } from "prismjs";
import "prismjs/components/prism-typescript";
import * as React from "react";

const Code: React.FC<{ code: string; language: string }> = ({
  code,
  language = "javascript"
}) => {
  const languageL = language.toLowerCase();
  const prismLanguage = languages[languageL];
  return (
    <div className="text-sm my-4">
      <pre className={`language-${language.replace(" ", "").toLowerCase()}`}>
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
