import { StoreLayoutEntity } from "../entities/StoreLayout";

export interface IStoreLayoutRepository {
  findById(id: string): Promise<StoreLayoutEntity | null>;
  save(layout: StoreLayoutEntity): Promise<void>;
}
