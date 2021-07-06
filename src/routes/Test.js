import React from "react";

const Test = ({match}) => {
    return (
        <div>
            <span>{match.params.test}</span>
            <span>asd</span>
        </div>
    )
}

export default Test;