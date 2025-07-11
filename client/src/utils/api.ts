const API_BASE_URL = 'http://localhost:5100/api/v1';

export interface Plot {
  _id: string;
  primeLocationName: string;
  address: string;
  pinCode: string;
  pricePerUnit: number;
  numUnits: number;
  numOccupied?: number;
  numVacant?: number;
  createdBy?: string;
}

export interface Slot {
  _id?: string;
  id?: string;
  plotId: string;
  status: 'occupied' | 'vacant';
  slotNumber?: number;
}

export interface Reservation {
  _id: string;
  userId: string;
  plotId: string;
  slotId: string;
  status: 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  plot?: {
    _id: string;
    primeLocationName: string;
    address: string;
    pinCode: string;
    pricePerUnit: number;
    numUnits: number;
  };
  user?: {
    _id: string;
    fullName: string;
    email: string;
  };
  slotInfo?: {
    _id: string;
    slotNumber: number;
    status: string;
  };
}

export interface CreatePlotData {
  primeLocationName: string;
  address: string;
  pinCode: string;
  pricePerUnit: string;
  numUnits: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  msg: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

class ApiService {
  private getAuthHeaders(token: string | null) {
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async getPlots(token: string | null): Promise<Plot[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/plots`, {
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch plots');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching plots:', error);
      throw error;
    }
  }

  async createPlot(plotData: CreatePlotData, token: string | null): Promise<Plot> {
    try {
      const response = await fetch(`${API_BASE_URL}/plots`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(plotData)
      });

      if (!response.ok) {
        throw new Error('Failed to create plot');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating plot:', error);
      throw error;
    }
  }

  async updatePlot(plotId: string, plotData: Partial<Plot>, token: string | null): Promise<Plot> {
    try {
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(plotData)
      });

      if (!response.ok) {
        throw new Error('Failed to update plot');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating plot:', error);
      throw error;
    }
  }

  async deletePlot(plotId: string, token: string | null): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/plots/${plotId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to delete plot');
      }
    } catch (error) {
      console.error('Error deleting plot:', error);
      throw error;
    }
  }

  async getSlotsByPlot(plotId: string, token: string | null): Promise<Slot[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/plot/${plotId}`, {
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch slots');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching slots:', error);
      throw error;
    }
  }

  async deleteSlot(slotId: string, token: string | null): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/slots/${slotId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to delete slot');
      }
    } catch (error) {
      console.error('Error deleting slot:', error);
      throw error;
    }
  }

  async createReservation(plotId: string, userId: string, token: string | null): Promise<Reservation> {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${plotId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async getUserReservations(userId: string, token: string | null): Promise<Reservation[]> {
    try {
      console.log('Fetching reservations for userId:', userId);
      const response = await fetch(`${API_BASE_URL}/reservations/user/${userId}`, {
        headers: this.getAuthHeaders(token)
      });

      console.log('getUserReservations response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('getUserReservations error:', errorText);
        throw new Error(`Failed to fetch user reservations: ${response.status}`);
      }

      const data = await response.json();
      console.log('getUserReservations data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  }

  async getAllReservations(token: string | null): Promise<Reservation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all reservations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching all reservations:', error);
      throw error;
    }
  }

  async getAllUsers(token: string | null): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: this.getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async cancelReservation(reservationId: string, token: string | null): Promise<{ msg: string }> {
    try {
      console.log('API: Cancelling reservation with ID:', reservationId);
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(token)
      });

      console.log('Cancel reservation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cancel reservation error:', errorText);
        throw new Error(`Failed to cancel reservation: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }

  async completeReservation(reservationId: string, token: string | null): Promise<{ msg: string }> {
    try {
      console.log('API: Completing reservation with ID:', reservationId);
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/complete`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(token)
      });

      console.log('Complete reservation response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Complete reservation error:', errorText);
        throw new Error(`Failed to complete reservation: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing reservation:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();