import React, { Component } from 'react';
import './SelectableCard.css';

class SelectableCard extends Component {
    render() {
      const { selected, onClick, index, children } = this.props;
      const className = selected ? "selectable selected" : "selectable";
  
      return (
        <div className="card">
          <div className={className}>
            {children}
            {selected && <div className="check"><span className="checkmark">✔</span></div>}
          </div>
        </div>
      );
    }
  }

export default SelectableCard;
