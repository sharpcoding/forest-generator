export enum EnumForestGeneratingStatus {
  Initial,
  IsGenerating,
  Generated
}

export enum EnumImageDownloadingStatus {
  NotRequested,
  Requested
}

/**
 * A UI-related fragment of application state referenced in making some 
 * "toastified" notifications to the user
 */
export interface INotifications {
  readonly forestGeneratingStatus: EnumForestGeneratingStatus;
  readonly imageDownloadingStatus: EnumImageDownloadingStatus;
}