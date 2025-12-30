import { parentService } from "../../shared";
import type {
  IHotel,
  INewHotel,
  IUpdateHotel,
} from "../interfaces/hote.interface";

export class HotelService extends parentService<
  IHotel,
  INewHotel,
  IUpdateHotel
> {
  constructor() {
    super("hotel");
  }
}
