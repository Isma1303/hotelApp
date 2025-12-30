import { parentService } from "../../shared";
import type {
  IRoom,
  IRoomNew,
  IRoomUpdate,
} from "../interfaces/room.interface";

export class RoomsService extends parentService<IRoom, IRoomNew, IRoomUpdate> {
  constructor() {
    super("rooms");
  }
}
