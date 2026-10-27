import { StoreLayoutEntity } from "../../domain/entities/StoreLayout";
import { IStoreLayoutRepository } from "../../domain/repositories/IStoreLayoutRepository";

export class InMemoryStoreLayoutRepository implements IStoreLayoutRepository {
  private layouts: Map<string, StoreLayoutEntity> = new Map();

  async findById(id: string): Promise<StoreLayoutEntity | null> {
    return this.layouts.get(id) ?? null;
  }

  async save(layout: StoreLayoutEntity): Promise<void> {
    this.layouts.set(layout.id, layout);
  }
}
