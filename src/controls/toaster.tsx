import * as React from "react";
import { ActionCreatorsMapObject, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { IState } from "../state/index";
import { ToastContainer, toast } from 'react-toastify';
import { treeGenerationStatusSelector, ITreeGenerationStatusSelectorResult } from '../selectors/treeGenerationStatus';

export interface IToasterOwnProps {
}

export interface IToasterProps {
  treeGenerationStatusSelectorResult: ITreeGenerationStatusSelectorResult;
}

export interface IToasterState {
}

export interface IToasterActionCreators extends ActionCreatorsMapObject {
}

export class ToasterControl extends React.Component<IToasterProps & IToasterActionCreators, IToasterState> {
  constructor(props: IToasterProps & IToasterActionCreators) {
    super(props);
    this.state = {};
  }

  public shouldComponentUpdate(nextProps: IToasterProps, nextState: IToasterState): boolean {
    if (!nextProps.treeGenerationStatusSelectorResult.updateOnProgress)
      return false;
    if (this.props.treeGenerationStatusSelectorResult.percentComplete != nextProps.treeGenerationStatusSelectorResult.percentComplete) {
      if (nextProps.treeGenerationStatusSelectorResult.percentComplete == 100)
        toast.success("Tree generation completed !");
      else
        toast.info(`Tree generation ${nextProps.treeGenerationStatusSelectorResult.percentComplete.toFixed(0)} % complete`);
    }
    return false;
  }
  
  public render() {
    return (<ToastContainer
      position="top-center"
      type="default"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
    />)
  }
}

function mapStateToProps(state: IState): IToasterProps {
  return {
    treeGenerationStatusSelectorResult: treeGenerationStatusSelector(state)
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<IToasterActionCreators>({}, dispatch);
}

export default connect<IToasterProps, IToasterActionCreators, IToasterOwnProps>(mapStateToProps, matchDispatchToProps)(ToasterControl);

