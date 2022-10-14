export class CreateTrackDto {
  readonly name: string;
  readonly artist: string;
  readonly text: string;
  readonly album?: string;
  readonly listeners?: number;
  readonly created_at?: Date;
  readonly created_by?: string;
}
