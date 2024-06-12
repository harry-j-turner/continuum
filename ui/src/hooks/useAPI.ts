import { useEffect, useState } from 'react';
import { Thought, Tag } from '../types';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';

// Set based on domain. For local development, use 'http://localhost:8000/api'
const API_BASE_URL =
  window.location.origin === 'http://localhost:3000'
    ? 'http://localhost:8000/api'
    : 'https://api.continuum-journal.com/api';

type Entity = Thought | Tag;

type DjangoPaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Entity[];
};

type DjangoRetrieveResponse = Entity;
type DjangoCreateResponse = Entity;
type DjangoUpdateResponse = Entity;

let token = '';

const useAPI = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getToken = async () => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) return storedToken;

    const newToken = await getAccessTokenSilently();
    localStorage.setItem('access_token', newToken);
    return newToken;
  };

  const callAPI = async (path: string, body?: unknown, method = 'GET'): Promise<Response | null> => {
    if (!token) {
      token = await getToken();
    }

    const url = `${API_BASE_URL}/${path}`;
    const headers = new Headers();
    const isFormData = body instanceof FormData;
    headers.append('Authorization', `Bearer ${token}`);

    if (!isFormData) {
      headers.append('Content-Type', 'application/json');
      body = JSON.stringify(body);
    }

    const response = await fetch(url, {
      method,
      headers: headers,
      body: isFormData ? (body as FormData) : (body as string)
    });

    if (!response.ok) {
      try {
        const data = await response.json();
        console.error(data);
      } catch (e) {
        console.error('No JSON data');
      }
      return null;
    }
    return response;
  };

  // Thoughts API
  // ###########

  interface CreateThought {
    thought: Omit<Thought, 'id'>;
  }

  const createThought = async ({ thought }: CreateThought): Promise<Thought | null> => {
    const response = await callAPI('thoughts/', thought, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Thought;
  };

  interface RetrieveThought {
    id: string;
  }

  const retrieveThought = async ({ id }: RetrieveThought): Promise<Thought | null> => {
    const response = await callAPI(`thoughts/${id}/`);
    if (!response) return null;
    const data: DjangoRetrieveResponse = await response.json();
    return data as Thought;
  };

  interface ListThoughts {
    startDate?: string;
    endDate?: string;
    tags?: string[];
  }

  const listThoughts = async ({ startDate, endDate, tags }: ListThoughts): Promise<Thought[] | null> => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (tags) tags.forEach((tag) => params.append('tags', tag));

    const response = await callAPI(`thoughts/?${params.toString()}`);
    if (!response) return null;
    const data: DjangoPaginatedResponse = await response.json();
    return data.results as Thought[];
  };

  interface UpdateThought {
    thought: Thought;
  }

  const updateThought = async ({ thought }: UpdateThought): Promise<Thought | null> => {
    const response = await callAPI(`thoughts/${thought.id}/`, thought, 'PATCH');
    if (!response) return null;
    const data: DjangoUpdateResponse = await response.json();
    return data as Thought;
  };

  interface DeleteThought {
    id: string;
  }

  const deleteThought = async ({ id }: DeleteThought): Promise<void | null> => {
    const response = await callAPI(`thoughts/${id}/`, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  // Tag API
  // #######

  interface CreateTag {
    tag: Omit<Tag, 'id'>;
  }

  const createTag = async ({ tag }: CreateTag): Promise<Tag | null> => {
    const response = await callAPI('tags/', tag, 'POST');
    if (!response) return null;
    const data: DjangoCreateResponse = await response.json();
    return data as Tag;
  };

  const listTags = async (): Promise<Tag[] | null> => {
    const response = await callAPI('tags/');
    if (!response) return null;
    const data: DjangoPaginatedResponse = await response.json();
    return data.results as Tag[];
  };

  interface DeleteTag {
    id: string;
  }

  const deleteTag = async ({ id }: DeleteTag): Promise<void | null> => {
    const response = await callAPI(`tags/${id}/`, {}, 'DELETE');
    if (!response) return null;
    return;
  };

  // Report API
  // ##########

  const generateReport = async (): Promise<null> => {
    const response = await callAPI('report/');
    if (!response) return null;
    return null;
  };

  return {
    createThought,
    updateThought,
    retrieveThought,
    deleteThought,
    listThoughts,
    createTag,
    listTags,
    deleteTag,
    generateReport
  };
};

export default useAPI;
