import { rgba } from "polished";
import { toggleMark } from "prosemirror-commands";
import { MarkSpec, MarkType } from "prosemirror-model";
import markInputRule from "../lib/markInputRule";
import markRule from "../rules/mark";
import Mark from "./Mark";

export default class Highlight extends Mark {
  /** The colors that can be used for highlighting */
  static colors = ["#FDEA9B", "#04FDC5", "#3b82f6", "#8b5cf6", "#f43f5e", "#ef4444", "#f59e0b"];

  /** The names of the colors that can be used for highlighting, must match length of array above */
  static colorNames = ["Coral", "Bright Teal", "Blue", "Violet", "Rose", "Red", "Amber"];

  /** The default opacity of the highlight */
  static opacity = 0.4;

  get name() {
    return "highlight";
  }

  get schema(): MarkSpec {
    return {
      attrs: {
        color: {
          default: null,
        },
      },
      parseDOM: [
        {
          tag: "mark",
          getAttrs: (dom) => {
            const color = dom.getAttribute("data-color") || "";

            return {
              color: Highlight.colors.includes(color) ? color : null,
            };
          },
        },
      ],
      toDOM: (node) => [
        "mark",
        {
          "data-color": node.attrs.color,
          style: `background-color: ${rgba(
            node.attrs.color || Highlight.colors[0],
            Highlight.opacity
          )}`,
        },
      ],
    };
  }

  inputRules({ type }: { type: MarkType }) {
    return [markInputRule(/(?:==)([^=]+)(?:==)$/, type)];
  }

  keys({ type }: { type: MarkType }) {
    return {
      "Mod-Ctrl-h": toggleMark(type),
    };
  }

  get rulePlugins() {
    return [markRule({ delim: "==", mark: "highlight" })];
  }

  toMarkdown() {
    return {
      open: "==",
      close: "==",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "highlight" };
  }
}
