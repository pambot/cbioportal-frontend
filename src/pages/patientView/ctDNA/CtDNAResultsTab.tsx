import * as React from 'react';
import * as _ from 'lodash';
import {Mutation} from "../../../shared/api/generated/CBioPortalAPI";
import SampleManager from "../sampleManager";
import LinePlotVAFTime from "./LinePlotVAFTime"
import HeatmapVAFEvents from "./HeatmapVAFEvents"

interface ICtDNAResultsTabProps {
    mergedMutations: Mutation[][];
    sampleManager:SampleManager;
}

interface ICtDNAResultsTabState {
  linePlotGene: string;
  heatmapGeneList: string[];
  value: string;
}

export default class CtDNAResultsTab extends React.Component<ICtDNAResultsTabProps, ICtDNAResultsTabState> {

  validGenes:string[];

  constructor(props:ICtDNAResultsTabProps) {
    super(props);
    this.state = {
      linePlotGene: 'TP53',
      heatmapGeneList: ['TP53', 'IDH1', 'ZNF107'],
      value: '',
    };
    this.validGenes = this.getValidGenes();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getValidGenes() {
    let mutations = _.flatten(this.props.mergedMutations);
    let mutGenes:string[] = [];
    _.each(mutations, (mutation:Mutation) => {
      mutGenes.push(mutation.gene.hugoGeneSymbol);
    });
    return _.uniq(mutGenes);
  }

  handleChange(event:any) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event:any) {
    //debugger;
    let queryStr = this.state.value;
    if (queryStr) {
      let queryGenes = queryStr.split(' ');
      let validQueryGenes:string[] = [];
      _.each(queryGenes, (gene:string) => {
        if (~this.validGenes.indexOf(gene)) {
          validQueryGenes.push(gene);
        }
      });
      this.setState({
        heatmapGeneList: validQueryGenes,
        linePlotGene: validQueryGenes[0],
        value: validQueryGenes.join(' '),
      });
    }
    event.preventDefault();
  }

  public render() {

    // these div boxes are just for the current display
    // please remove if this prototype is further developed
    
    const divFloat = {
      width: "35%",
      float: "left",
    };

    const largeDiv = {
      width: "100%",
      height: "500px",
    };

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <textarea value={this.state.value} onChange={this.handleChange} rows={5} cols={50}/>
        <br/>
        <input type="submit" value="Update Plots" />
      </form>

      <br/>

      <div style={divFloat}>
      <HeatmapVAFEvents
        heatmapGeneList={this.state.heatmapGeneList}
        mergedMutations={this.props.mergedMutations}
        sampleManager={this.props.sampleManager}/>
      </div>

      <br/><br/>

      <div style={divFloat}>
      <LinePlotVAFTime
        linePlotGene={this.state.linePlotGene}
        mergedMutations={this.props.mergedMutations}
        sampleManager={this.props.sampleManager}/>
      </div>

      <div style={largeDiv}></div>

      </div>
    )
  }
}
