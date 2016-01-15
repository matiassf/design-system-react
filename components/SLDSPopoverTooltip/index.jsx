/*
Copyright (c) 2015, salesforce.com, inc. All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


import React from "react";
import ReactDOM from "react-dom";

import tooltip from "./tooltip";
import flatten from "lodash.flatten";
import compact from "lodash.compact";

const displayName = "SLDSPopoverTooltip";
const propTypes = {
  /**
   * Alignment of the Tooltip relative to the element that triggers it.
   */
  align: React.PropTypes.oneOf(["top", "right", "bottom", "left"]).isRequired,
  /**
   * Pass the element that triggers Tooltip as a child of the Tooltip component. It must be either an anchor or button so keyboard users can tab to it.
   */
  children: React.PropTypes.node,
  /**
   * Content inside Tooltip.
   */
  content: React.PropTypes.node.isRequired,
  /**
   * Delay on Tooltip closing.
   */
  hoverCloseDelay: React.PropTypes.number,
  openByDefault: React.PropTypes.bool,
  target: React.PropTypes.any
};
const defaultProps = {
  align: "top",
  content: <span>Tooltip</span>,
  hoverCloseDelay: 350,
};

/**
 * The SLDSPopoverTooltip component is variant of the Popover component. This component wraps an element that triggers it to open. It must be a focusable child element (either a button or anchor) so that keyboard users can navigate to it.
 * For more details, please reference <a href="http://www.lightningdesignsystem.com/components/popovers#tooltips">SLDS Popovers > Tooltips</a>.
 */
class SLDSPopoverTooltip extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isClosing: false,
      isOpen: this.props.openByDefault,
    };
  }

  componentDidMount() {
    this.setState({
      isMounted: true,
      el: ReactDOM.findDOMNode(this)
    });
  }

  componentWillUnmount() {
    this.setState({
      isMounted: false
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.target && this.props.target !== prevProps.target){
      this.setState({
        tooltipTarget: this.getTooltipTarget()
      })
    }
    if(!prevState.isMounted && this.state.isMounted){
      setTimeout( ()=> {
        this.setState({
          isOpen: this.props.openByDefault
        });
      }.bind(this));
    }
  }

  getTooltipTarget() {
    return this.props.target?this.props.target:this.state.el;
  }

  getTriggerId() {
    const trigger = this.getTooltipTarget();
    if(trigger){
      return trigger.getAttribute("data-reactid");
    }
  }

  handleMouseClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      isClosing: !this.state.isOpen
    });
  }

  handleMouseEnter() {
    this.setState({
      isOpen: true,
      isClosing: false
    });
  }

  handleMouseLeave() {
    this.setState({ isClosing: true });

    setTimeout(()=>{
      if(this.state.isMounted && this.state.isClosing){
        this.setState({
          isOpen: false,
          isClosing: false
        });
      }
    },this.props.hoverCloseDelay);
  }

  getTooltipContent() {
    return <div id={this.getTriggerId()} className="slds-popover__body">{this.props.content}</div>;
  }

  handleCancel() {
    this.setState({
      isOpen: false,
      isClosing: false
    });
  }

  getTooltip() {
    return this.state.isOpen?tooltip.getTooltip(this.props, this.getTooltipContent(), this.getTooltipTarget(), this.handleCancel.bind(this)):<span></span>;
  }

  render(){
    const containerStyles = { display: "inline" };
    return (
      <div
        aria-describedby={this.getTriggerId()}
        style={containerStyles}
        ref="tooltipTarget"
        role="tooltip"
        onBlur={this.handleMouseLeave.bind(this)}
        onFocus={this.handleMouseEnter.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)} >
        { this.props.children }
        <span className="slds-assistive-text">{this.props.content}</span>
        { this.getTooltip() }
      </div>
    );
  }

}


SLDSPopoverTooltip.displayName = displayName;
SLDSPopoverTooltip.propTypes = propTypes;
SLDSPopoverTooltip.defaultProps = defaultProps;

module.exports = SLDSPopoverTooltip;

