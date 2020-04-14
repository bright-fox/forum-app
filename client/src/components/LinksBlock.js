import React from 'react';
import { notImplemented } from '../utils';

export default () => {
    return (
        <div className="ui segment">
            <div className="flex">
                <div style={{ marginLeft: "15px" }}>
                    <div className="link pointer" onClick={notImplemented}>About</div>
                    <div className="link pointer" onClick={notImplemented}>Careers</div>
                    <div className="link pointer" onClick={notImplemented}>Press</div>
                    <div className="link pointer" onClick={notImplemented}>Advertise</div>
                    <div className="link pointer" onClick={notImplemented}>Blog</div>
                </div>
                <div style={{ marginLeft: "30px" }}>
                    <div className="link pointer" onClick={notImplemented}>Terms</div>
                    <div className="link pointer" onClick={notImplemented}>Content Policy</div>
                    <div className="link pointer" onClick={notImplemented}>Privacy Policy</div>
                    <div className="link pointer" onClick={notImplemented}>Mod Policy</div>
                </div>
            </div>
            <div style={{ marginLeft: "15px", marginTop: "10px" }}>Talky Inc &copy; 2020. All rights reserved</div>
        </div>
    );
}