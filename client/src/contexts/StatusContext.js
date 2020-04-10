import React from 'react';
import { idleStatus } from '../utils/variables';

export default React.createContext({ statusState: { status: idleStatus, msg: "Oops, something went wrong.." }, dispatchStatus: () => { } })