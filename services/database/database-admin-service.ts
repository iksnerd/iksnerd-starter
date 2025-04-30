import { firestore } from "firebase-admin";
import {
  BatchOperation,
  DatabaseService,
  FieldNameAndValue,
  OrderByOptions,
  PaginationOptions,
  QueryConstraint,
} from "@/core";
import DocumentData = firestore.DocumentData;
import Timestamp = firestore.Timestamp;
import DocumentSnapshot = firestore.DocumentSnapshot;
import FieldValue = firestore.FieldValue;
import { Filter } from "firebase-admin/firestore";
import { firestoreAdmin } from "@/infrastructure/firebase-admin/client";

/**
 * Convert a timestamp fields to date fields
 *
 * @param {DocumentData | undefined} documentData
 *
 * @return {DocumentData | undefined}
 */
function convertTimestampsToDates(
  documentData: DocumentData | undefined,
): DocumentData | undefined {
  // Base case: if the object is null or undefined, return it as-is
  if (documentData === null || documentData === undefined) {
    return documentData;
  }

  // Check if the object is a Firestore Timestamp
  if (documentData instanceof Timestamp) {
    // Transform the Timestamp as needed
    // Here, I'll convert it to a Date object, but you can modify as required
    return documentData.toDate();
  }

  // If the object is an array, map over it and transform its elements
  if (Array.isArray(documentData)) {
    return documentData.map(convertTimestampsToDates);
  }

  // If the object is of type object, traverse its keys and transform them
  if (typeof documentData === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(documentData)) {
      result[key] = convertTimestampsToDates(documentData[key]);
    }
    return result;
  }

  // If the object doesn't match any of the above conditions, return it as-is
  return documentData;
}

/**
 * Convert a snapshot to data
 *
 * @template T
 *
 * @param {DocumentSnapshot} snapshot
 *
 * @return {T}
 */
export function snapshotToData<T>(snapshot: DocumentSnapshot): T {
  const data = convertTimestampsToDates(snapshot.data()) as T & {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };

  return {
    ...data,
    id: snapshot.id,
    createdAt: data.createdAt ? data.createdAt : null,
    updatedAt: data.updatedAt ? data.updatedAt : null,
  };
}

/**
 * Database service
 *
 * @export
 * @interface DatabaseService
 */
export const databaseService: DatabaseService = {
  /**
   * Get a document from a collection by id
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {string} id
   *
   * @return {Promise<T | null>}
   */
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const documentSnapshot = await firestoreAdmin
      .collection(collectionName)
      .doc(id)
      .get();

    if (documentSnapshot.exists) {
      return snapshotToData<T>(documentSnapshot);
    }

    return null;
  },

  /**
   * Get all documents from a collection
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {PaginationOptions} paginationOptions
   * @param {OrderByOptions} orderByOptions
   *
   * @return {Promise<T[]>}
   */
  async getAll<T>(
    collectionName: string,
    paginationOptions: PaginationOptions = {},
    orderByOptions?: OrderByOptions,
  ): Promise<T[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      firestoreAdmin.collection(collectionName);

    if (paginationOptions.limit) {
      query = query.limit(paginationOptions.limit);
    }

    if (paginationOptions.cursor) {
      query = query.startAfter(paginationOptions.cursor);
    }

    if (orderByOptions) {
      query = query.orderBy(orderByOptions.field, orderByOptions.direction);
    }

    const querySnapshot = await query.get();

    return querySnapshot.docs.map((d) => snapshotToData<T>(d));
  },

  /**
   * Get all documents from a collection by fields
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {QueryConstraint[]} queryConstraints
   * @param {PaginationOptions} paginationOptions
   * @param {OrderByOptions} orderByOptions
   *
   * @return {Promise<T[]>}
   */
  async getAllByFields<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
    paginationOptions: PaginationOptions,
    orderByOptions?: OrderByOptions,
  ): Promise<T[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      firestoreAdmin.collection(collectionName);

    for (const queryConstraint of queryConstraints) {
      query = query.where(
        queryConstraint.field,
        queryConstraint.operator,
        queryConstraint.value,
      );
    }

    if (paginationOptions.limit) {
      query = query.limit(paginationOptions.limit);
    }

    if (paginationOptions.cursor) {
      query = query.startAfter(paginationOptions.cursor);
    }

    if (orderByOptions) {
      query = query.orderBy(orderByOptions.field, orderByOptions.direction);
    }

    const querySnapshot = await query.get();

    return querySnapshot.docs.map((d) => snapshotToData<T>(d));
  },

  /**
   * Get all documents from a collection by OR fields
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {QueryConstraint[]} queryConstraints
   * @param {PaginationOptions} paginationOptions
   * @param {OrderByOptions} orderByOptions
   *
   * @return {Promise<T[]>}
   */
  async getAllByOrFields<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
    paginationOptions: PaginationOptions,
    orderByOptions?: OrderByOptions,
  ): Promise<T[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      firestoreAdmin.collection(collectionName);

    if (queryConstraints.length) {
      const filters = [];

      for (const queryConstraint of queryConstraints) {
        filters.push(
          Filter.where(
            queryConstraint.field,
            queryConstraint.operator,
            queryConstraint.value,
          ),
        );
      }

      query = query.where(Filter.or(...filters));
    }

    if (paginationOptions.limit) {
      query = query.limit(paginationOptions.limit);
    }

    if (paginationOptions.cursor) {
      query = query.startAfter(paginationOptions.cursor);
    }

    if (orderByOptions) {
      query = query.orderBy(orderByOptions.field, orderByOptions.direction);
    }

    const querySnapshot = await query.get();

    return querySnapshot.docs.map((d) => snapshotToData<T>(d));
  },

  /**
   * Get all documents from a collection group by fields
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {QueryConstraint[]} queryConstraints
   * @param {PaginationOptions} paginationOptions
   * @param {OrderByOptions} orderByOptions
   *
   * @return {Promise<T[]>}
   */
  async getAllGroup<T>(
    collectionName: string,
    queryConstraints: QueryConstraint[],
    paginationOptions: PaginationOptions,
    orderByOptions?: OrderByOptions,
  ): Promise<T[]> {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      firestoreAdmin.collectionGroup(collectionName);

    for (const queryConstraint of queryConstraints) {
      query = query.where(
        queryConstraint.field,
        queryConstraint.operator,
        queryConstraint.value,
      );
    }

    if (paginationOptions.limit) {
      query = query.limit(paginationOptions.limit);
    }

    if (paginationOptions.cursor) {
      query = query.startAfter(paginationOptions.cursor);
    }

    if (orderByOptions) {
      query = query.orderBy(orderByOptions.field, orderByOptions.direction);
    }

    const querySnapshot = await query.get();

    return querySnapshot.docs.map((d) => snapshotToData<T>(d));
  },

  /**
   * Create a document in a collection
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {T} data
   *
   * @return {Promise<string>} The id of the created document
   */
  async create<T>(collectionName: string, data: T): Promise<string> {
    const documentRef = firestoreAdmin.collection(collectionName).doc();

    await documentRef.set({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return documentRef.id;
  },

  /**
   * Set a document in a collection by id
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {T} data
   *
   * @return {Promise<void>}
   */
  async set<T>(collectionName: string, id: string, data: T): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.set({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Batch set a document in a collection by id
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {string|null} id
   * @param {T} data
   *
   * @return {void}
   */
  batchSet<T>(
    collectionName: string,
    id: string | null,
    data: T,
  ): BatchOperation {
    return (batch: FirebaseFirestore.WriteBatch) => {
      const documentRef = id
        ? firestoreAdmin.collection(collectionName).doc(id)
        : firestoreAdmin.collection(collectionName).doc();

      batch.set(documentRef, {
        ...data,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    };
  },

  /**
   * Update a document in a collection by id
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {T} data
   *
   * @return {Promise<void>}
   */
  async update<T>(collectionName: string, id: string, data: T): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Increment a field in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {string} field
   * @param {number} value
   *
   * @return {Promise<void>}
   */
  async increment(
    collectionName: string,
    id: string,
    field: string,
    value: number = 1,
  ): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.update({
      [field]: firestore.FieldValue.increment(value),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Increment a field in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {FieldNameAndValue} fields
   *
   * @return {Promise<void>}
   */
  async incrementMany(
    collectionName: string,
    id: string,
    fields: FieldNameAndValue[],
  ): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    const updateObject: Record<string, FieldValue> = {};

    for (const field of fields) {
      updateObject[field.name] = firestore.FieldValue.increment(field.value);
    }

    await documentRef.update({
      ...updateObject,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Decrement a field in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {string} field
   * @param {number} value
   */
  async decrement(
    collectionName: string,
    id: string,
    field: string,
    value: number = 1,
  ): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.update({
      [field]: firestore.FieldValue.increment(-value),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Delete a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   *
   * @return {Promise<void>}
   */
  async delete(collectionName: string, id: string): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.delete();
  },

  /**
   * Execute batch operations
   *
   * @param {BatchOperation[]} operations
   * @param {number} batchSize
   *
   * @return {Promise<void>}
   */
  async executeBatchOperations(
    operations: BatchOperation[],
    batchSize: number = 500,
  ): Promise<void> {
    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = firestoreAdmin.batch();
      const chunk = operations.slice(i, i + batchSize);

      for (const operation of chunk) {
        operation(batch);
      }

      console.log(`Executing batch operation ${i + 1}/${operations.length}`);
      await batch.commit();
    }
  },

  /**
   * Union elements in an array field in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {string} field
   * @param {string[]} elements
   *
   * @return {Promise<void>}
   */
  async arrayUnion(
    collectionName: string,
    id: string,
    field: string,
    elements: string[],
  ): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.update({
      [field]: firestore.FieldValue.arrayUnion(...elements),
    });
  },

  /**
   * Remove elements from an array field in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {string} field
   * @param {string[]} elements
   *
   * @return {Promise<void>}
   */
  async arrayRemove(
    collectionName: string,
    id: string,
    field: string,
    elements: string[],
  ): Promise<void> {
    const documentRef = firestoreAdmin.collection(collectionName).doc(id);

    await documentRef.update({
      [field]: firestore.FieldValue.arrayRemove(...elements),
    });
  },
};
