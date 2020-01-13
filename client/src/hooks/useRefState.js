import { useRef, useState } from "react";

export default initValue => {
  const [state, setState] = useState(initValue);
  const stateRef = useRef(state);

  return [state, stateRef, setState];
};
