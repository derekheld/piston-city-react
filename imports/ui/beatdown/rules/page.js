import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { RulesSections } from '../../../api/rulesSections.js';
import { Rules } from '../../../api/rules.js';

import Rule from './Rule.js';

import '/imports/less/beatdown.less';
import '/imports/less/beatdownRules.less';
 
// App component - represents the whole app
class BeatdownRulesPage extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      selectedSection: "",
      rules: []
    };
  }


  //TODO: The settimeout here gives the view time to build its collections. There must be a better way.
  componentWillReceiveProps(props){
    setTimeout( function(){
      if(props.sections.length > 0 && this.state.selectedSection.length == 0){
        this.selectSection({section: props.sections[0]});
      }
    }.bind(this), 200);
  }
  
 
  render() {
	  return (
		  <div id="beatdown-page">
    		<div className="read-block">
				  <div id="beatdown-rules">
				  	{this.renderNavSection()}
				  	{this.renderRules()}
	    		</div>
    		</div>
		  </div>
    );
  }


  renderRules(){
    rulesRender = this.state.rules.map(rule => <Rule rule={rule} key={rule._id}/>);
  	return(
      <div className="rules-body">
        <div className="rule-section">
          {rulesRender}
        </div>
      </div>
    );
  }


  sanitizeSectionName(name){
    return name.toLowerCase().replace(' ', '-');
  }

  selectSection({section}){
    this.setState({selectedSection: this.sanitizeSectionName(section.name)})
    this.setState({rules: Rules.find({section: section._id},  {sort: {position: 1}}).fetch()})
  }


  renderNavSection(){
    sectionRenders = this.props.sections.map(section => {
      sectionClass = 'entry'
      if(this.sanitizeSectionName(section.name) == this.state.selectedSection){
        sectionClass += " selected";
      }

      return(
        <div className={sectionClass} onClick={this.selectSection.bind(this, {section})}>
          <span className="inner-entry" key={section._id}>{section.name}</span>
        </div>
      );
    }
    );

  	return(
		  <div id="beatdown-rules-nav">
				<div className="entries">
          {sectionRenders}
				</div>
		    <div className="search-holder">
					<input disabled placeholder="Search coming soon..." />
				</div>
			</div>
		);
  }
}

export default withTracker(() => {
  return {
    sections: RulesSections.find({}, {sort: {position: 1}}).fetch()
  };
})(BeatdownRulesPage);