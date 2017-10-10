export enum EnumForestGeneratingState {
  Initial,
  IsGenerating,
  Generated
}

/**
 * A UI-related fragment of application state referenced in making some 
 * "toastified" notifications to the user
 */
export interface INotifications {
  readonly forestGeneratingState: EnumForestGeneratingState;
}