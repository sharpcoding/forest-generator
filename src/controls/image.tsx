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

export interface IImageControlOwnProps {
}

export interface IImageControlProps {
  width: number;
  height: number;
  sprite: ISprite;
  forest: IForest;
}

export interface IImageControlState {
  image: HTMLImageElement;
}

export interface IImageControlActionCreators extends ActionCreatorsMapObject {
  generateForest: (value: IParameters) => void;
}

export class CanvasControl extends React.Component<IImageControlProps & IImageControlActionCreators, IImageControlState> {
  constructor(props: IImageControlProps & IImageControlActionCreators) {
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
    let trees = _.sortBy(this.props.forest.trees, (tree: ITree) => tree.y).reverse(); 
    _.each(trees, (tree: ITree) => {
      ctx.drawImage(this.state.image, 
        tree.spriteColumn * this.props.sprite.columnWidth, 
        tree.spriteRow * this.props.sprite.rowHeight,
        this.props.sprite.columnWidth,
        this.props.sprite.rowHeight,
        tree.x,
        tree.y,
        this.props.sprite.columnWidth,
        this.props.sprite.rowHeight);
    });
  }

  private _refresh = (ctx: CanvasRenderingContext2D) => {
    if (_.isEmpty(this.props.sprite) || _.isEmpty(this.props.sprite.pathUrl))
      return;
    console.log('refreshing', this.state.image, this.props.forest, this.props.sprite);
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
    return (
      <span>
        <button onClick={() => { 
          this.props.generateForest({
            numberOfTrees: 300,
            imageWidth: this.props.width,
            imageHeight: this.props.height,
            spriteColumns: this.props.sprite.columns,
            spriteRows: this.props.sprite.rows
          }); }}>
          Generate forest
        </button>
        <canvas 
          width={this.props.width} 
          height={this.props.height}
          ref={(canvas) => _.isObject(canvas) ? this._refresh(canvas.getContext("2d")) : { }} />
      </span>);
  }
}

function mapStateToProps(state: IState): IImageControlProps {
  return {
    width: state.parameters.imageWidth,
    height: state.parameters.imageHeight,
    sprite: state.config.sprite,
    forest: state.forest
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators<IImageControlActionCreators>({
    generateForest: actions.generateForest
  }, dispatch);
}

export default connect<IImageControlProps, IImageControlActionCreators, IImageControlOwnProps>(mapStateToProps, matchDispatchToProps)(CanvasControl);

