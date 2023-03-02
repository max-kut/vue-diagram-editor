import { ulid } from "ulid";

export default class Link {
  id = null;
  title = null;
  start_id = null;
  start_port = null;
  end_id = null;
  end_port = null;
  animated = null;
  is_dark = null;
  inverted_flow = null;

  /**
   * @param {String} props.id
   * @param {String} props.title
   * @param {String} props.start_id
   * @param {String} props.start_port
   * @param {String} props.end_id
   * @param {String} props.end_port
   * @param {Boolean} props.animated
   * @param {Boolean} props.is_dark
   * @param {Boolean} props.inverted_flow
   */
  constructor(props) {
    this.id = props.id || ulid();
    this.title = props.title || null;
    if (!props.start_id) throw new Error("start_id is empty!");
    this.start_id = props.start_id;
    this.start_port = props.start_port || "default";
    if (!props.end_id) throw new Error("end_id is empty!");
    this.end_id = props.end_id;
    this.end_port = props.end_port || "default";
    this.animated = props.animated || false;
    this.is_dark = props.is_dark || false;
    this.inverted_flow = props.inverted_flow || false;
  }
}
