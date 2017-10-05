import { ITree } from "../state/forest/tree";
import { IGenerationParameters } from "../state/generationParameters/index";

export interface IGenerator {
  generate(params: IGenerationParameters): ITree[];
}