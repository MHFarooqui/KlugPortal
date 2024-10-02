import React from 'react';
import './klugAddBtn.scss';

const KlugAddBtn = ({onClick}) => {
    return (
        <>
            <button type="button" className="button" onClick={onClick}>
                <span className="button__text">Assign</span>
                <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" height="24" fill="none" class="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
            </button>
        </>
    )
}

export default React.memo(KlugAddBtn);
