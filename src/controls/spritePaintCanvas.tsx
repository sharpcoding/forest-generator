import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import * as dateFns from 'date-fns';
import * as fileDownload from "react-file-download";
import { connect } from "react-redux";
import { IState } from "../state/index";
import { ISprite } from "../state/config/sprite";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { ActionCreatorsMapObject } from "redux";
import { IForest } from "../state/forest/index";
import { ITree } from "../state/forest/tree";
import { IGenerationParameters } from "../state/generationParameters";
import { actions } from "../actions/index";
import { EnumImageDownloadingStatus } from "../state/notifications/index";

export interface ISpritePaintCanvasControlOwnProps {
}

export interface ISpritePaintCanvasControlProps {
  width: number;
  height: number;
  sprite: ISprite;
  forest: IForest;
  imageDownloadStatus: EnumImageDownloadingStatus;
}

export interface ISpritePaintCanvasControlState {
  spriteImage: HTMLImageElement;
}

export interface ISpritePaintCanvasControlActionCreators extends ActionCreatorsMapObject {
  imageDownloadStatusChange: (value: EnumImageDownloadingStatus) => void;
}

export class SpritePaintCanvasControl extends React.Component<ISpritePaintCanvasControlProps & ISpritePaintCanvasControlActionCreators, ISpritePaintCanvasControlState> {
  private _canvasRef: HTMLCanvasElement;
  
  constructor(props: ISpritePaintCanvasControlProps & ISpritePaintCanvasControlActionCreators) {
    super(props);
    this.state = {
      spriteImage: null
    };
  }

  private _loadImageAndSetToState = (ctx: CanvasRenderingContext2D): Promise<{}> => {
    return new Promise((resolve, reject) => {
      if (_.isObject(this.state.spriteImage)) {
        resolve();
        return;
      }
      const image = new Image();
      image.src = this.props.sprite.pathUrl;
      image.onload = () => {
        this.setState({
          spriteImage: image
        });
        resolve();
      }
    });
  }

  private _repaintImage = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, this.props.width, this.props.height);
    let trees = _.sortBy(this.props.forest.trees, t => t.canvasImageY); 
    _.each(trees, (tree: ITree) => {
      ctx.drawImage(this.state.spriteImage, 
        tree.spriteColumn * this.props.sprite.columnWidth, 
        tree.spriteRow * this.props.sprite.rowHeight,
        this.props.sprite.columnWidth,
        this.props.sprite.rowHeight,
        tree.canvasImageX,
        tree.canvasImageY,
        this.props.sprite.columnWidth,
        this.props.sprite.rowHeight);
    });
  }

  private _refresh = (ctx: CanvasRenderingContext2D) => {
    if (_.isEmpty(this.props.sprite) || _.isEmpty(this.props.sprite.pathUrl))
      return;
    if (!_.isObject(!this.state.spriteImage))
      this._loadImageAndSetToState(ctx).then(() => {
        this._repaintImage(ctx);
      })
    else
      this._repaintImage(ctx);
  }

  public shouldComponentUpdate(nextProps: ISpritePaintCanvasControlProps, nextState: ISpritePaintCanvasControlState): boolean {
    if ((this.props.imageDownloadStatus == EnumImageDownloadingStatus.NotRequested) &&
        (nextProps.imageDownloadStatus == EnumImageDownloadingStatus.Requested)) {
      this._canvasRef.toBlob((blob) => {
        fileDownload(blob, `forest_${dateFns.format(Date(), "YYYYMMDD_HHmmss")}.png`);
        setTimeout(() => this.props.imageDownloadStatusChange(EnumImageDownloadingStatus.NotRequested), 1000);
      });
    }
    return true;
  }

  public render() {
    if ((!(_.isNumber(this.props.width) && this.props.width > 0)) ||
        (!(_.isNumber(this.props.height) && this.props.height > 0)))
      return (<div>Unable to generate image - height/width are invalid</div>)
    return <canvas 
      width={this.props.width} 
      height={this.props.height}
      ref={(canvas) => { 
        if (_.isObject(canvas)) {
          this._canvasRef = canvas;
          this._refresh(canvas.getContext("2d"));
        }}} />
  }
}

function mapStateToProps(state: IState): ISpritePaintCanvasControlProps {
  return {
    width: state.generationParameters.imageWidth,
    height: state.generationParameters.imageHeight,
    sprite: state.config.sprite,
    forest: state.forest,
    imageDownloadStatus: state.notifications.imageDownloadingStatus
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<ISpritePaintCanvasControlActionCreators>({
    imageDownloadStatusChange: actions.imageDownloadStatusChange
  }, dispatch);
}

export default connect<ISpritePaintCanvasControlProps, ISpritePaintCanvasControlActionCreators, ISpritePaintCanvasControlOwnProps>(mapStateToProps, matchDispatchToProps)(SpritePaintCanvasControl);