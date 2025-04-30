import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getAggregateFromServer,
  getCountFromServer,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  startAfter,
  sum,
  Timestamp,
  updateDoc,
  where,
} from "@firebase/firestore";
import {
  DatabaseClientService,
  DataCallback,
  ErrorCallback,
  OrderByOptions,
  PaginationOptions,
  QueryConstraint as CoreQueryConstraint,
  UnsubscribeFn,
} from "@/core";
import { firebaseClient } from "@/infrastructure";

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
 * @returns {T}
 */
function snapshotToData<T>(snapshot: DocumentSnapshot) {
  const data = convertTimestampsToDates(snapshot.data()) as T & {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };

  return {
    ...data,
    id: snapshot.id,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}
/**
 * Database service
 *
 * @export
 * @interface DatabaseClientService
 */
export const databaseClientService: DatabaseClientService = {
  /**
   * Get a document from a collection by id
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {string} id
   *
   * @returns {Promise<T | null>}
   */
  async get<T>(collectionName: string, id: string): Promise<T | null> {
    const collectionRef = collection(firebaseClient.firestore, collectionName);
    const docRef = doc(collectionRef, id);
    const documentSnapshot = await getDoc(docRef);

    if (documentSnapshot.exists()) {
      return snapshotToData<T>(documentSnapshot);
    }

    return null;
  },

  /**
   * Get document from a collection by field
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {CoreQueryConstraint[]} queryConstraints
   *
   * @returns {Promise<T | null>}
   */
  async getByField<T>(
    collectionName: string,
    queryConstraints: CoreQueryConstraint[],
  ): Promise<T | null> {
    const collectionRef = collection(firebaseClient.firestore, collectionName);

    const constraints: QueryConstraint[] = queryConstraints.map((x) =>
      where(x.field, x.operator, x.value),
    );

    constraints.push(limit(1));

    const q = query(collectionRef, ...constraints);

    const snapshots = await getDocs(q);

    if (snapshots.empty) {
      return null;
    }

    return snapshotToData<T>(snapshots.docs[0]);
  },

  /**
   * Get all documents from a collection paginated
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {CoreQueryConstraint[]} queryConstraints
   * @param {PaginationOptions} paginationOptions
   * @param {OrderByOptions} orderByOptions
   *
   * @returns {Promise<T[]>}
   */
  async getPaginated<T>(
    collectionName: string,
    queryConstraints: CoreQueryConstraint[],
    paginationOptions: PaginationOptions = {
      limit: 10,
    },
    orderByOptions: OrderByOptions = {
      field: "createdAt",
      direction: "desc",
    },
  ): Promise<T[]> {
    const collectionRef = collection(firebaseClient.firestore, collectionName);

    const constraints: QueryConstraint[] = [];

    for (const x of queryConstraints) {
      constraints.push(where(x.field, x.operator, x.value));
    }

    if (orderByOptions) {
      constraints.push(orderBy(orderByOptions.field, orderByOptions.direction));
    }

    if (paginationOptions.limit) {
      constraints.push(limit(paginationOptions.limit));
    }

    if (paginationOptions.cursor) {
      const docRef = await getDoc(doc(collectionRef, paginationOptions.cursor));
      constraints.push(startAfter(docRef));
    }

    const q = query(collectionRef, ...constraints);
    const documentsSnapshots = await getDocs(q);

    if (documentsSnapshots.empty) {
      return [];
    }

    return documentsSnapshots.docs
      .filter((x) => x !== null)
      .map((doc) => snapshotToData<T>(doc)) as T[];
  },

  /**
   * Get all documents from a collection group paginated
   */
  async getPaginatedGroup<T>(
    collectionName: string,
    queryConstraints: CoreQueryConstraint[],
    paginationOptions: PaginationOptions = {
      limit: 10,
    },
    orderByOptions: OrderByOptions = {
      field: "createdAt",
      direction: "desc",
    },
  ): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    for (const x of queryConstraints) {
      constraints.push(where(x.field, x.operator, x.value));
    }

    if (paginationOptions.limit) {
      constraints.push(limit(paginationOptions.limit));
    }

    if (orderByOptions) {
      constraints.push(orderBy(orderByOptions.field, orderByOptions.direction));
    }

    const collectionRef = collectionGroup(
      firebaseClient.firestore,
      collectionName,
    );

    const q = query(collectionRef, ...constraints);
    const documentsSnapshots = await getDocs(q);

    if (documentsSnapshots.empty) {
      return [];
    }

    return documentsSnapshots.docs
      .filter((x) => x !== null)
      .map((doc) => snapshotToData<T>(doc)) as T[];
  },

  /**
   * Get all documents from a collection
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {CoreQueryConstraint[]} queryConstraints
   * @param {OrderByOptions} orderByOptions
   *
   * @returns {Promise<T[]>}
   */
  async getAll<T>(
    collectionName: string,
    queryConstraints: CoreQueryConstraint[] = [],
    orderByOptions: OrderByOptions = {
      field: "createdAt",
      direction: "desc",
    },
  ): Promise<T[]> {
    const collectionRef = collection(firebaseClient.firestore, collectionName);

    const constraints: QueryConstraint[] = [];

    for (const x of queryConstraints) {
      constraints.push(where(x.field, x.operator, x.value));
    }

    if (orderByOptions) {
      constraints.push(orderBy(orderByOptions.field, orderByOptions.direction));
    }

    const q = query(collectionRef, ...constraints);
    const documentsSnapshots = await getDocs(q);

    if (documentsSnapshots.empty) {
      return [];
    }

    return documentsSnapshots.docs
      .filter((x) => x !== null)
      .map((doc) => snapshotToData<T>(doc)) as T[];
  },

  /**
   * Get all documents from a collection group
   */
  async getAllGroup<T>(
    collectionName: string,
    queryConstraints: CoreQueryConstraint[] = [],
    orderByOptions: OrderByOptions = {
      field: "createdAt",
      direction: "desc",
    },
  ): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    for (const x of queryConstraints) {
      constraints.push(where(x.field, x.operator, x.value));
    }

    if (orderByOptions) {
      constraints.push(orderBy(orderByOptions.field, orderByOptions.direction));
    }

    const collectionRef = collectionGroup(
      firebaseClient.firestore,
      collectionName,
    );

    const q = query(collectionRef, ...constraints);
    const documentsSnapshots = await getDocs(q);

    if (documentsSnapshots.empty) {
      return [];
    }

    return documentsSnapshots.docs
      .filter((x) => x !== null)
      .map((doc) => snapshotToData<T>(doc)) as T[];
  },

  /**
   * Subscribe to a collection
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {DataCallback<T>} onDataCallback
   * @param {ErrorCallback} onErrorCallback
   * @param {CoreQueryConstraint[]} queryConstraints
   * @param {OrderByOptions} orderByOptions
   *
   * @returns {UnsubscribeFn}
   */
  getSubscription<T>(
    collectionName: string,
    onDataCallback: DataCallback<T>,
    onErrorCallback: ErrorCallback,
    queryConstraints: CoreQueryConstraint[],
    orderByOptions?: OrderByOptions,
  ): UnsubscribeFn {
    const constraints: QueryConstraint[] = [];

    for (const x of queryConstraints) {
      constraints.push(where(x.field, x.operator, x.value));
    }

    if (orderByOptions) {
      constraints.push(orderBy(orderByOptions.field, orderByOptions.direction));
    }

    const collectionRef = collection(firebaseClient.firestore, collectionName);

    const q = query(collectionRef, ...constraints);

    return onSnapshot(
      q,
      (snapshot) => {
        const data: T[] = snapshot.docs.map((doc) => snapshotToData<T>(doc));

        onDataCallback(data);
      },
      onErrorCallback,
    );
  },

  /**
   * Create a document in a collection
   *
   * @template T
   *
   * @param {string} collectionName
   * @param {T} data
   *
   * @returns {Promise<string>} The id of the created document
   */
  async create<T>(collectionName: string, data: T): Promise<string> {
    const collectionReference = collection(
      firebaseClient.firestore,
      collectionName,
    );
    const documentReference = await addDoc(collectionReference, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return documentReference.id;
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
   * @returns {Promise<void>}
   */
  async set<T>(collectionName: string, id: string, data: T): Promise<void> {
    const documentRef = doc(firebaseClient.firestore, collectionName, id);

    await setDoc(documentRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
   * @returns {Promise<void>}
   */
  async update<T>(collectionName: string, id: string, data: T): Promise<void> {
    const documentRef = doc(firebaseClient.firestore, collectionName, id);

    await updateDoc(documentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Add elements to an array in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {string} field
   * @param {unknown[]} values
   *
   * @returns {Promise<void>}
   */
  async updateArrayUnion(
    collectionName: string,
    id: string,
    field: string,
    values: unknown[],
  ): Promise<void> {
    const documentRef = doc(firebaseClient.firestore, collectionName, id);

    await updateDoc(documentRef, {
      [field]: arrayUnion(...values),
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Remove elements from an array in a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   * @param {string} field
   * @param {unknown[]} values
   *
   * @returns {Promise<void>}
   */
  async updateArrayRemove(
    collectionName: string,
    id: string,
    field: string,
    values: unknown[],
  ): Promise<void> {
    const documentRef = doc(firebaseClient.firestore, collectionName, id);

    await updateDoc(documentRef, {
      [field]: arrayRemove(...values),
      updatedAt: serverTimestamp(),
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
   * @returns {Promise<void>}
   */
  async updateIncrement(
    collectionName: string,
    id: string,
    field: string,
    value: number,
  ): Promise<void> {
    const documentRef = doc(firebaseClient.firestore, collectionName, id);

    await updateDoc(documentRef, {
      [field]: increment(value),
      updatedAt: serverTimestamp(),
    });
  },

  async count(
    collectionName: string,
    queryConstraints: CoreQueryConstraint[],
  ): Promise<number | null> {
    const collectionRef = collection(firebaseClient.firestore, collectionName);

    const constraints: QueryConstraint[] = queryConstraints.map((x) =>
      where(x.field, x.operator, x.value),
    );

    const q = query(collectionRef, ...constraints);

    const snapshot = await getCountFromServer(q);

    return snapshot.data().count;
  },

  async sum(
    collectionName: string,
    field: string,
    queryConstraints: CoreQueryConstraint[],
  ): Promise<number | null> {
    const collectionRef = collection(firebaseClient.firestore, collectionName);

    const constraints: QueryConstraint[] = queryConstraints.map((x) =>
      where(x.field, x.operator, x.value),
    );

    const q = query(collectionRef, ...constraints);

    const snapshot = await getAggregateFromServer(q, {
      // totalPopulation: sum("population"),
      total: sum(field),
    });

    return snapshot.data().total;
  },

  /**
   * Delete a document in a collection by id
   *
   * @param {string} collectionName
   * @param {string} id
   *
   * @returns {Promise<void>}
   */
  async delete(collectionName: string, id: string): Promise<void> {
    const documentRef = doc(firebaseClient.firestore, collectionName, id);

    await deleteDoc(documentRef);
  },
};
