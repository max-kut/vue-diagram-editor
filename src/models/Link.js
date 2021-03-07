import {ulid} from "ulid";

export default class Link {
  id = null;
  start_id = null;
  start_port = null;
  end_id = null;
  end_port = null;

  /**
   * @param {String} props.id
   * @param {String} props.start_id
   * @param {String} props.start_port
   * @param {String} props.end_id
   * @param {String} props.end_port
   */
  constructor(props) {
    this.id = props.id || ulid();
    if (!props.start_id) throw new Error('start_id is empty!');
    this.start_id = props.start_id;
    this.start_port = props.start_port || 'default';
    if (!props.end_id) throw new Error('end_id is empty!');
    this.end_id = props.end_id;
    this.end_port = props.end_port || 'default';
  }
}
