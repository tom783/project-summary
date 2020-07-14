import React from 'react';
import styled from 'styled-components';

function CircleButton(props) {
  const { className } = props;
  return (
    <div className={className}>
      <div className="hello">
        CircleButton
      </div>
    </div>
  );
}


const S_CircleButton = styled(CircleButton)`
  .hello{
    color:red
  }
`;

export default S_CircleButton;