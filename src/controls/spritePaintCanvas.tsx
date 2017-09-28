import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { connect } from "react-redux";
import { IState } from "../state/index";
import { ISprite } from "../state/config/sprite/index";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";
import { ActionCreatorsMapObject } from "redux";
import { IForest } from "../state/forest/index";
import { ITree } from "../state/forest/tree";
import { IParameters } from "../state/parameters/index";
import { actions } from "../actions/index";

export interface ISpritePaintCanvasControlOwnProps {
}

export interface ISpritePaintCanvasControlProps {
  width: number;
  height: number;
  sprite: ISprite;
  forest: IForest;
}

export interface ISpritePaintCanvasControlState {
  image: HTMLImageElement;
}

export interface IImageControlActionCreators extends ActionCreatorsMapObject {
}

export class SpritePaintCanvasControl extends React.Component<ISpritePaintCanvasControlProps & IImageControlActionCreators, ISpritePaintCanvasControlState> {
  constructor(props: ISpritePaintCanvasControlProps & IImageControlActionCreators) {
    super(props);
    this.state = {
      image: null
    };
  }

  private _loadImageAndSetToState = (ctx: CanvasRenderingContext2D): Promise<{}> => {
    return new Promise((resolve, reject) => {
      if (_.isObject(this.state.image)) {
        resolve();
        return;
      }
      const image = new Image();
      image.src = this.props.sprite.pathUrl;
      image.onload = () => {
        this.setState({
          image: image
        });
        resolve();
      }
    });
  }

  private _repaintImage = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, this.props.width, this.props.height);
    let trees = _.sortBy(this.props.forest.trees, t => t.canvasImageY); 
    _.each(trees, (tree: ITree) => {
      ctx.drawImage(this.state.image, 
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
    if (!_.isObject(!this.state.image))
      this._loadImageAndSetToState(ctx).then(() => {
        this._repaintImage(ctx);
      })
    else
      this._repaintImage(ctx);
  }

  public render() {
    if ((!(_.isNumber(this.props.width) && this.props.width > 0)) ||
        (!(_.isNumber(this.props.height) && this.props.height > 0)))
      return (<div>Unable to generate image - height/width are invalid</div>)
    return <canvas 
        width={this.props.width} 
        height={this.props.height}
        ref={(canvas) => _.isObject(canvas) ? this._refresh(canvas.getContext("2d")) : { }} />
  }
}

function mapStateToProps(state: IState): ISpritePaintCanvasControlProps {
  return {
    width: state.parameters.imageWidth,
    height: state.parameters.imageHeight,
    sprite: state.config.sprite,
    forest: state.forest
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<IImageControlActionCreators>({}, dispatch);
}

export default connect<ISpritePaintCanvasControlProps, IImageControlActionCreators, ISpritePaintCanvasControlOwnProps>(mapStateToProps, matchDispatchToProps)(SpritePaintCanvasControl);

