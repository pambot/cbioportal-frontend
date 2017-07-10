import * as React from 'react';
import {observer} from "mobx-react";
import {Button, ButtonGroup} from 'react-bootstrap';
import LoadingIndicator from "shared/components/loadingIndicator/LoadingIndicator";
import StructureViewerPanel from "shared/components/structureViewer/StructureViewerPanel";
import DiscreteCNACache from "shared/cache/DiscreteCNACache";
import OncoKbEvidenceCache from "shared/cache/OncoKbEvidenceCache";
import PubMedCache from "shared/cache/PubMedCache";
import CancerTypeCache from "shared/cache/CancerTypeCache";
import MutationCountCache from "shared/cache/MutationCountCache";
import {IMyCancerGenomeData} from "shared/model/MyCancerGenome";
import PdbHeaderCache from "shared/cache/PdbHeaderCache";
import {DEFAULT_PROTEIN_IMPACT_TYPE_COLORS} from "shared/lib/MutationUtils";
import {MutationMapperStore} from "./MutationMapperStore";
import ResultsViewMutationTable from "./ResultsViewMutationTable";
import LollipopMutationPlot from "../../../shared/components/lollipopMutationPlot/LollipopMutationPlot";
import ProteinImpactTypePanel from "../../../shared/components/mutationTypePanel/ProteinImpactTypePanel";
import ProteinChainPanel from "../../../shared/components/proteinChainPanel/ProteinChainPanel";
import {computed, action, observable} from "mobx";

export interface IMutationMapperProps {
    store: MutationMapperStore;
    studyId?: string;
    studyToCancerType?:{[studyId:string]:string};
    myCancerGenomeData?: IMyCancerGenomeData;
    discreteCNACache?:DiscreteCNACache;
    oncoKbEvidenceCache?:OncoKbEvidenceCache;
    cancerTypeCache?:CancerTypeCache;
    mutationCountCache?:MutationCountCache;
    pdbHeaderCache?: PdbHeaderCache;
    pubMedCache?:PubMedCache;
    enableOncoKb?: boolean;
    enableMyCancerGenome?: boolean;
    enableHotspot?: boolean;
    enableCivic?: boolean;
}

@observer
export default class MutationMapper extends React.Component<IMutationMapperProps, {}>
{
    @observable protected is3dPanelOpen = false;
    @observable lollipopPlotGeneX:number = 0;
    @observable geneWidth:number = 665;

    private handlers:any;

    constructor(props: IMutationMapperProps) {
        super(props);

        this.open3dPanel = this.open3dPanel.bind(this);
        this.close3dPanel = this.close3dPanel.bind(this);
        this.toggle3dPanel = this.toggle3dPanel.bind(this);
        this.handlers = {
            resetDataStore:()=>{
                this.props.store.dataStore.resetFilterAndSelection();
            },
            onXAxisOffset:action((offset:number)=>{this.lollipopPlotGeneX = offset;})
        };
    }

    public render() {
        return (
            <div>
                {
                    (this.is3dPanelOpen) && (
                        <StructureViewerPanel
                            mutationDataStore={this.props.store.dataStore}
                            pdbChainDataStore={this.props.store.pdbChainDataStore}
                            pdbAlignmentIndex={this.props.store.indexedAlignmentData}
                            pdbHeaderCache={this.props.pdbHeaderCache}
                            pdbPositionMappingCache={this.props.store.pdbPositionMappingCache}
                            onClose={this.close3dPanel}
                            {...DEFAULT_PROTEIN_IMPACT_TYPE_COLORS}
                        />
                    )
                }

                <LoadingIndicator isLoading={this.props.store.mutationData.isPending || this.props.store.gene.isPending} />
                {
                    (this.props.store.mutationData.isComplete && this.props.store.gene.result) && (
                        <div>
                            <LollipopMutationPlot
                                store={this.props.store}
                                onXAxisOffset={this.handlers.onXAxisOffset}
                                geneWidth={this.geneWidth}
                                {...DEFAULT_PROTEIN_IMPACT_TYPE_COLORS}
                            />
                            <ProteinChainPanel
                                store={this.props.store}
                                pdbHeaderCache={this.props.pdbHeaderCache}
                                geneWidth={this.geneWidth}
                                geneXOffset={this.lollipopPlotGeneX}
                                maxChainsHeight={200}
                            />
                            <div style={{marginLeft:"45px", marginTop:"5px", marginBottom:"10px"}}>
                                <ButtonGroup className="pull-right">
                                    <Button className="btn-default" disabled={this.props.store.pdbChainDataStore.allData.length === 0} onClick={this.toggle3dPanel}>
                                        3D Structure »
                                    </Button>
                                </ButtonGroup>
                                <ProteinImpactTypePanel
                                    dataStore={this.props.store.dataStore}
                                    {...DEFAULT_PROTEIN_IMPACT_TYPE_COLORS}
                                />
                            </div>
                            {!this.props.store.dataStore.showingAllData &&
                                (<div style={{
                                    marginTop:"5px",
                                    marginBottom:"5px"
                                }}>
                                    <span style={{color:"red", fontSize:"14px", fontFamily:"verdana,arial,sans-serif"}}>
                                        <span>Current view shows filtered results. Click </span>
                                        <a style={{cursor:"pointer"}} onClick={this.handlers.resetDataStore}>here</a>
                                        <span> to reset all filters.</span>
                                    </span>
                                </div>)
                            }
                            <ResultsViewMutationTable
                                studyId={this.props.studyId}
                                studyToCancerType={this.props.studyToCancerType}
                                discreteCNACache={this.props.discreteCNACache}
                                oncoKbEvidenceCache={this.props.oncoKbEvidenceCache}
                                pubMedCache={this.props.pubMedCache}
                                cancerTypeCache={this.props.cancerTypeCache}
                                mutationCountCache={this.props.mutationCountCache}
                                dataStore={this.props.store.dataStore}
                                myCancerGenomeData={this.props.myCancerGenomeData}
                                hotspots={this.props.store.indexedHotspotData}
                                cosmicData={this.props.store.cosmicData.result}
                                oncoKbData={this.props.store.oncoKbData}
                                enableOncoKb={this.props.enableOncoKb}
                                enableHotspot={this.props.enableHotspot}
                                enableMyCancerGenome={this.props.enableMyCancerGenome}
                                enableCivic={this.props.enableCivic}
                            />
                    </div>
                    )
                }
            </div>
        );
    }

    private toggle3dPanel() {
        if (this.is3dPanelOpen) {
            this.close3dPanel();
        } else {
            this.open3dPanel();
        }
    }

    private open3dPanel() {
        this.is3dPanelOpen = true;
        this.props.store.pdbChainDataStore.selectFirstChain();
    }

    private close3dPanel() {
        this.is3dPanelOpen = false;
        this.props.store.pdbChainDataStore.selectUid();
    }
}