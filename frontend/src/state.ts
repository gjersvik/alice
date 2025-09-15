export type Msg = {type: 'sendChat'; text: string};

export type Dispatch = (msg: Msg) => void;