// Types
import {
  Timesheet,
  CreateTimesheetRequest,
  CreateTimesheetEntryRequest,
  TimesheetEntry,
  UpdateTimesheetEntryRequest,
  User
} from './types';

class APIService {
  private static instance: APIService;
  private bearerToken: string | null = null;
  //private readonly baseUrl: string = 'http://192.168.0.14:8000/api';
  private readonly baseUrl: string = 'https://api.valkyriecare.co.uk/api';

  private constructor() {}

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public setToken(token: string | null): void {
    this.bearerToken = token;
  }

  private async get(endpoint: string): Promise<Response | null> {
    if (!this.bearerToken) {
      console.error('Bearer token is not set.');
      return null;
    }
    try {
      return fetch(endpoint, {
        method: 'GET',
        headers: {
          'x-authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('GET request failed:', error);
      return null;
    }
  }

  private async delete(endpoint: string): Promise<Response | null> {
    if (!this.bearerToken) {
      console.error('Bearer token is not set.');
      return null;
    }
    try {
      return fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'x-authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('DELETE request failed:', error);
      return null;
    }
  }

  private async post(endpoint: string, body: any): Promise<any> {
    if (!this.bearerToken) {
      throw new Error('Bearer token is not set.');
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }

  private async put(endpoint: string, body: any): Promise<any> {
    if (!this.bearerToken) {
      throw new Error('Bearer token is not set.');
    }
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'x-authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  private async lookupUser(username: string): Promise<User | null> {
    const endpoint = `${this.baseUrl}/users/lookup/?username=${username}`;
    const response = await this.get(endpoint);
    if (!response) {
      return null;
    }
    return await response.json();
  }

  private async createTimesheet(body: CreateTimesheetRequest): Promise<Timesheet | null> {
    const endpoint = `${this.baseUrl}/timesheet/`;
    const response = await this.post(endpoint, body);
    if (!response) {
      return null;
    }
    return response;
  }

  private async listTimesheets(): Promise<Timesheet[] | null> {
    const endpoint = `${this.baseUrl}/timesheet`;
    const response = await this.get(endpoint);
    if (!response) {
      return null;
    }
    return await response.json();
  }

  private async deleteTimesheet(id: string): Promise<Response | null> {
    const endpoint = `${this.baseUrl}/timesheet/${id}/`;
    return await this.delete(endpoint);
  }

  private async createTimesheetEntry(
    timesheetID: string,
    body: CreateTimesheetEntryRequest
  ): Promise<TimesheetEntry | null> {
    const endpoint = `${this.baseUrl}/timesheet/${timesheetID}/timesheet-entries/`;
    return await this.post(endpoint, body);
  }

  private async updateTimesheetEntry(
    timesheetID: string,
    entryID: string,
    body: UpdateTimesheetEntryRequest
  ): Promise<TimesheetEntry | null> {
    const endpoint = `${this.baseUrl}/timesheet/${timesheetID}/timesheet-entries/${entryID}/`;
    return await this.put(endpoint, body);
  }

  private async deleteTimesheetEntry(
    timesheetID: string,
    entryID: string
  ): Promise<Response | null> {
    const endpoint = `${this.baseUrl}/timesheet/${timesheetID}/timesheet-entries/${entryID}/`;
    return await this.delete(endpoint);
  }

  public timesheets = {
    create: (body: CreateTimesheetRequest) => this.createTimesheet(body),
    list: () => this.listTimesheets(),
    delete: (id: string) => this.deleteTimesheet(id),
    deleteEntry: (timesheetID: string, entryID: string) =>
      this.deleteTimesheetEntry(timesheetID, entryID),
    createEntry: (timesheetID: string, body: CreateTimesheetEntryRequest) =>
      this.createTimesheetEntry(timesheetID, body),
    updateEntry: (timesheetID: string, entryID: string, body: UpdateTimesheetEntryRequest) =>
      this.updateTimesheetEntry(timesheetID, entryID, body)
  };

  public users = {
    lookup: (username: string) => this.lookupUser(username)
  };
}

export default APIService;
