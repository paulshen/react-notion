import * as React from "react";
import Asset from "./components/asset";
import Code from "./components/code";
import { Exercise } from "./components/Exercise";
import PageHeader from "./components/page-header";
import PageIcon from "./components/page-icon";
import { PostPaneLink } from "./components/PostPane";
import {
  BlockMapType,
  BlockType,
  BlockValueProp,
  ContentValueType,
  CustomBlockComponents,
  CustomDecoratorComponentProps,
  CustomDecoratorComponents,
  DecorationType,
  MapImageUrl,
  MapPageUrl
} from "./types";
import { classNames, getListNumber, getTextContent } from "./utils";

function MyCustomComponent(props: { children: React.ReactNode }) {
  const { children, ...restProps } = props;
  return (
    <div className="border border-dashed border-gray-300 px-4 pt-6 pb-2 relative">
      <div className="absolute top-0 left-0 font-mono bg-blue-100 text-xs px-4">
        {"<MyCustomComponent>"}
      </div>
      <code>props: {JSON.stringify(restProps)}</code>
      {children}
    </div>
  );
}

const CustomComponents: Record<string, React.ComponentType<any>> = {
  MyCustomComponent
};

export const createRenderChildText = (
  customDecoratorComponents: CustomDecoratorComponents | undefined,
  panes: any[]
) => (properties: DecorationType[]) => {
  return properties?.map(([text, decorations], i) => {
    if (!decorations) {
      return (
        <React.Fragment key={i}>
          {text.replace(new RegExp(String.fromCharCode(160), "g"), " ")}
        </React.Fragment>
      );
    }

    return decorations.reduceRight((element, decorator) => {
      const renderText = () => {
        switch (decorator[0]) {
          case "h":
            return (
              <span key={i} className={`notion-${decorator[1]}`}>
                {element}
              </span>
            );
          case "c":
            return (
              <code key={i} className="bg-gray-100">
                {element}
              </code>
            );
          case "b":
            return <b key={i}>{element}</b>;
          case "i":
            return <em key={i}>{element}</em>;
          case "s":
            return <s key={i}>{element}</s>;
          case "a":
            const href = decorator[1];
            const re = /^\/([0-9a-f]{32})$/;
            const matches = re.exec(href);
            if (matches !== null) {
              const paneId = matches![1];
              const pane = panes.find(p => p.id.replace(/-/g, "") === paneId);
              if (pane !== undefined) {
                return (
                  <PostPaneLink panes={panes} pane={pane} key={i}>
                    {element}
                  </PostPaneLink>
                );
              } else {
                return (
                  <a
                    className="underline"
                    href={`https://notion.so${decorator[1]}`}
                    key={i}
                  >
                    {element}
                  </a>
                );
              }
            }
            return (
              <a className="underline" href={decorator[1]} key={i}>
                {element}
              </a>
            );

          default:
            return <React.Fragment key={i}>{element}</React.Fragment>;
        }
      };

      const CustomComponent = customDecoratorComponents?.[decorator[0]];

      if (CustomComponent) {
        const props = (decorator[1]
          ? {
              decoratorValue: decorator[1]
            }
          : {}) as CustomDecoratorComponentProps<typeof decorator[0]>;

        return (
          <CustomComponent
            key={i}
            {...(props as any)}
            renderComponent={renderText}
          >
            {text}
          </CustomComponent>
        );
      }

      return renderText();
    }, <>{text}</>);
  });
};

interface Block {
  block: BlockType;
  level: number;
  blockMap: BlockMapType;
  mapPageUrl: MapPageUrl;
  mapImageUrl: MapImageUrl;
  panes: any[];
  exercises: any[];
  renderEditor: (modelId: string, initialCode: string) => React.ReactNode;

  fullPage?: boolean;
  hideHeader?: boolean;
  customBlockComponents?: CustomBlockComponents;
  customDecoratorComponents?: CustomDecoratorComponents;
}

const ColorMap = {
  gray: "text-gray-400",
  brown: "text-gray-400",
  orange: "text-gray-400",
  yellow: "text-gray-400",
  teal: "text-gray-400",
  blue: "text-gray-400",
  purple: "text-gray-400",
  pink: "text-gray-400",
  red: "text-gray-400",
  gray_background: "bg-gray-100",
  brown_background: "bg-gray-400",
  orange_background: "bg-gray-400",
  yellow_background: "bg-gray-400",
  teal_background: "bg-gray-400",
  blue_background: "bg-gray-400",
  purple_background: "bg-gray-400",
  pink_background: "bg-gray-400",
  red_background: "bg-gray-400"
};

export const Block: React.FC<Block> = props => {
  const {
    block,
    panes,
    exercises,
    renderEditor,
    children,
    level,
    fullPage,
    hideHeader,
    blockMap,
    mapPageUrl,
    mapImageUrl,
    customBlockComponents,
    customDecoratorComponents
  } = props;
  const blockValue = block?.value;

  const renderComponent = () => {
    const renderChildText = createRenderChildText(
      customDecoratorComponents,
      panes
    );

    switch (blockValue?.type) {
      case "page":
        if (level === 0) {
          if (fullPage) {
            if (!blockValue.properties) {
              return null;
            }

            const {
              page_icon,
              page_cover,
              page_cover_position,
              page_full_width,
              page_small_text
            } = blockValue.format || {};

            const coverPosition = (1 - (page_cover_position || 0.5)) * 100;

            return (
              <div className="notion">
                {!hideHeader && (
                  <PageHeader
                    blockMap={blockMap}
                    mapPageUrl={mapPageUrl}
                    mapImageUrl={mapImageUrl}
                  />
                )}
                {page_cover && (
                  <img
                    src={mapImageUrl(page_cover, block)}
                    alt={getTextContent(blockValue.properties.title)}
                    className="notion-page-cover"
                    style={{
                      objectPosition: `center ${coverPosition}%`
                    }}
                  />
                )}
                <main
                  className={classNames(
                    "notion-page",
                    !page_cover && "notion-page-offset",
                    page_full_width && "notion-full-width",
                    page_small_text && "notion-small-text"
                  )}
                >
                  {page_icon && (
                    <PageIcon
                      className={
                        page_cover ? "notion-page-icon-offset" : undefined
                      }
                      block={block}
                      big
                      mapImageUrl={mapImageUrl}
                    />
                  )}

                  <div className="notion-title">
                    {renderChildText(blockValue.properties.title)}
                  </div>

                  {children}
                </main>
              </div>
            );
          } else {
            return <main className="text-sm">{children}</main>;
          }
        } else {
          if (!blockValue.properties) return null;
          const exercise = exercises.find((e: any) => e.id === blockValue.id);
          if (exercise !== undefined) {
            return (
              <Exercise
                exercise={exercise}
                renderChildText={renderChildText}
                renderEditor={renderEditor}
              />
            );
          }
          return (
            <a className="notion-page-link" href={mapPageUrl(blockValue.id)}>
              {blockValue.format && (
                <div className="notion-page-icon">
                  <PageIcon block={block} mapImageUrl={mapImageUrl} />
                </div>
              )}
              <div className="notion-page-text">
                {renderChildText(blockValue.properties.title)}
              </div>
            </a>
          );
        }
      case "header":
        if (!blockValue.properties) return null;
        return (
          <h1 className="text-2xl mt-10 mb-4 font-semibold">
            {renderChildText(blockValue.properties.title)}
          </h1>
        );
      case "sub_header":
        if (!blockValue.properties) return null;
        return (
          <h2 className="text-xl mt-10 mb-4 font-semibold">
            {renderChildText(blockValue.properties.title)}
          </h2>
        );
      case "sub_sub_header":
        if (!blockValue.properties) return null;
        return (
          <h3 className="text-lg mt-8 font-semibold">
            {renderChildText(blockValue.properties.title)}
          </h3>
        );
      case "divider":
        return <hr className="notion-hr" />;
      case "text":
        if (!blockValue.properties) {
          return <div>&nbsp;</div>;
        }
        const blockColor = blockValue.format?.block_color;
        return (
          <p
            className={classNames(
              "my-3 whitespace-pre-line",
              blockColor && `notion-${blockColor}`
            )}
          >
            {renderChildText(blockValue.properties.title)}
          </p>
        );
      case "bulleted_list":
      case "numbered_list":
        const wrapList = (content: React.ReactNode, start?: number) =>
          blockValue.type === "bulleted_list" ? (
            <ul className="list-disc pl-6">{content}</ul>
          ) : (
            <ol start={start} className="notion-list notion-list-numbered">
              {content}
            </ol>
          );

        let output: JSX.Element | null = null;

        if (blockValue.content) {
          output = (
            <>
              {blockValue.properties && (
                <li className="py-1">
                  {renderChildText(blockValue.properties.title)}
                </li>
              )}
              {wrapList(children)}
            </>
          );
        } else {
          output = blockValue.properties ? (
            <li>{renderChildText(blockValue.properties.title)}</li>
          ) : null;
        }

        const isTopLevel =
          block.value.type !== blockMap[block.value.parent_id].value.type;
        const start = getListNumber(blockValue.id, blockMap);

        return isTopLevel ? wrapList(output, start) : output;

      case "image":
      case "embed":
      case "figma":
      case "video":
        const value = block.value as ContentValueType;

        return (
          <figure
            className="max-w-full"
            style={
              value.format !== undefined
                ? { width: value.format.block_width }
                : undefined
            }
          >
            <Asset block={block} mapImageUrl={mapImageUrl} />

            {value.properties.caption && (
              <figcaption className="notion-image-caption">
                {renderChildText(value.properties.caption)}
              </figcaption>
            )}
          </figure>
        );
      case "code": {
        if (blockValue.properties.title) {
          const content = blockValue.properties.title[0][0];
          const language = blockValue.properties.language[0][0];
          return (
            <Code
              key={blockValue.id}
              language={language || ""}
              code={content}
              className="-mx-2 md:-mx-4 my-6"
            />
          );
        }
        break;
      }
      case "column_list":
        return <div className="sm:flex my-4 columns">{children}</div>;
      case "column":
        const spacerWith = 32;
        const ratio = blockValue.format.column_ratio;
        const columns = Number((1 / ratio).toFixed(0));
        const spacerTotalWith = (columns - 1) * spacerWith;
        const width = `calc((100% - ${spacerTotalWith}px) * ${ratio})`;
        return (
          <>
            <div
              className="column"
              style={{
                // @ts-ignore
                "--spacer-total-width": `${spacerTotalWith}px`,
                "--ratio": `${ratio}`
              }}
            >
              {children}
            </div>
            <div
              className="spacer"
              style={{
                // @ts-ignore
                "--spacer-width": `${spacerWith}px`
              }}
            />
          </>
        );
      case "quote":
        if (!blockValue.properties) return null;
        return (
          <blockquote className="notion-quote">
            {renderChildText(blockValue.properties.title)}
          </blockquote>
        );
      case "collection_view":
        if (!block) return null;

        const collectionView = block?.collection?.types[0];

        return (
          <div>
            <h3 className="notion-h3">
              {renderChildText(block.collection?.title!)}
            </h3>

            {collectionView?.type === "table" && (
              <div style={{ maxWidth: "100%", marginTop: 5 }}>
                <table className="notion-table">
                  <thead>
                    <tr className="notion-tr">
                      {collectionView.format?.table_properties
                        ?.filter(p => p.visible)
                        .map((gp, index) => (
                          <th
                            className="notion-th"
                            key={index}
                            style={{ minWidth: gp.width }}
                          >
                            {block.collection?.schema[gp.property]?.name}
                          </th>
                        ))}
                    </tr>
                  </thead>

                  <tbody>
                    {block?.collection?.data.map((row, index) => (
                      <tr className="notion-tr" key={index}>
                        {collectionView.format?.table_properties
                          ?.filter(p => p.visible)
                          .map((gp, index) => (
                            <td
                              key={index}
                              className={
                                "notion-td " +
                                (gp.property === "title" ? "notion-bold" : "")
                              }
                            >
                              {
                                renderChildText(
                                  row[
                                    block.collection?.schema[gp.property]?.name!
                                  ]
                                )!
                              }
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {collectionView?.type === "gallery" && (
              <div className="notion-gallery">
                {block.collection?.data.map((row, i) => (
                  <div key={`col-${i}`} className="notion-gallery-card">
                    <div className="notion-gallery-content">
                      {collectionView.format?.gallery_properties
                        ?.filter(p => p.visible)
                        .map((gp, idx) => (
                          <p
                            key={idx + "item"}
                            className={
                              "notion-gallery-data " +
                              (idx === 0 ? "is-first" : "")
                            }
                          >
                            {getTextContent(
                              row[block.collection?.schema[gp.property].name!]
                            )}
                          </p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "callout":
        return (
          <div
            className={classNames(
              "flex space-x-3 p-4",
              blockValue.format.block_color &&
                (ColorMap[blockValue.format.block_color] ?? undefined)
            )}
          >
            <div>
              <PageIcon block={block} mapImageUrl={mapImageUrl} />
            </div>
            <div className="notion-callout-text">
              {renderChildText(blockValue.properties.title)}
            </div>
          </div>
        );
      case "bookmark":
        const link = blockValue.properties.link;
        const title = blockValue.properties.title ?? link;
        const description = blockValue.properties.description;
        const block_color = blockValue.format?.block_color;
        const bookmark_icon = blockValue.format?.bookmark_icon;
        const bookmark_cover = blockValue.format?.bookmark_cover;

        return (
          <div className="notion-row">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                "notion-bookmark",
                block_color && `notion-${block_color}`
              )}
              href={link[0][0]}
            >
              <div>
                <div className="notion-bookmark-title">
                  {renderChildText(title)}
                </div>
                {description && (
                  <div className="notion-bookmark-description">
                    {renderChildText(description)}
                  </div>
                )}

                <div className="notion-bookmark-link">
                  {bookmark_icon && (
                    <img src={bookmark_icon} alt={getTextContent(title)} />
                  )}
                  <div>{renderChildText(link)}</div>
                </div>
              </div>
              {bookmark_cover && (
                <div className="notion-bookmark-image">
                  <img src={bookmark_cover} alt={getTextContent(title)} />
                </div>
              )}
            </a>
          </div>
        );
      case "toggle":
        if (blockValue.properties.title[0][0] === "Ignore") {
          return null;
        }

        const tagMatch = /^<(.+)>$/.exec(blockValue.properties.title[0][0]);
        if (tagMatch !== null) {
          const tagName = tagMatch[1];
          if (CustomComponents[tagName] !== undefined) {
            let props;
            if (blockValue.content!.length > 0) {
              const firstChildBlockId = blockValue.content![0];
              if (firstChildBlockId !== undefined) {
                const firstChildBlock = blockMap[firstChildBlockId];
                if (
                  firstChildBlock.value.type === "code" &&
                  firstChildBlock.value.properties.language[0][0] === "JSON"
                ) {
                  props = JSON.parse(
                    firstChildBlock.value.properties.title[0][0]
                  );
                }
              }
            }

            const Component = CustomComponents[tagName];
            return (
              <Component {...props}>
                {React.Children.toArray(children).slice(1)}
              </Component>
            );
          }
        }

        return (
          <details className="my-4">
            <summary>{renderChildText(blockValue.properties.title)}</summary>
            <div className="pl-4">{children}</div>
          </details>
        );
      case "tweet":
        return (
          <div className="max-w-xs mx-auto my-6">
            <blockquote className="twitter-tweet" data-conversation="none">
              <a href={blockValue.properties.source[0][0]}></a>
            </blockquote>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charSet="utf-8"
            ></script>
          </div>
        );
      default:
        if (process.env.NODE_ENV !== "production") {
          console.log("Unsupported type " + block?.value?.type);
        }
        return <div />;
    }
    return null;
  };

  // render a custom component first if passed.
  if (
    customBlockComponents &&
    customBlockComponents[blockValue?.type] &&
    // Do not use custom component for base page block
    level !== 0
  ) {
    const CustomComponent = customBlockComponents[blockValue?.type]!;
    return (
      <CustomComponent
        renderComponent={renderComponent}
        blockValue={blockValue as BlockValueProp<typeof blockValue.type>}
        level={level}
      >
        {children}
      </CustomComponent>
    );
  }

  return renderComponent();
};
