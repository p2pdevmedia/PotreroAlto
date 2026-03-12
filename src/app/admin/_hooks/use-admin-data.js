'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildRouteId, createId, DEFAULT_SECTOR_INFO, EMPTY_ROUTE, routeSectorFromSubsectorId } from '@/app/admin/_lib/admin-utils';

const PASSWORD_STORAGE_KEY = 'potrero-admin-password';

async function readAdminData(password) {
  const response = await fetch('/api/admin/database', {
    headers: { 'x-admin-password': password }
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error ?? 'No se pudo leer la base de datos.');
  }

  return payload;
}

export default function useAdminData() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sectorInfo, setSectorInfo] = useState(DEFAULT_SECTOR_INFO);
  const [subsectors, setSubsectors] = useState([]);

  const hasFeedback = Boolean(error || message);

  const hydrateData = useCallback((payload) => {
    const nextSubsectors = Array.isArray(payload?.subsectors) ? payload.subsectors : [];
    setSectorInfo({
      name: payload?.name || DEFAULT_SECTOR_INFO.name,
      location: payload?.location || DEFAULT_SECTOR_INFO.location,
      description: payload?.description || ''
    });
    setSubsectors(nextSubsectors);
  }, []);

  const login = useCallback(async (nextPassword) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = await readAdminData(nextPassword);
      setPassword(nextPassword);
      setAuthenticated(true);
      hydrateData(payload);
      localStorage.setItem(PASSWORD_STORAGE_KEY, nextPassword);
    } catch (loginError) {
      setAuthenticated(false);
      setError(loginError instanceof Error ? loginError.message : 'No se pudo autenticar.');
    } finally {
      setLoading(false);
    }
  }, [hydrateData]);

  const logout = useCallback(() => {
    setAuthenticated(false);
    setPassword('');
    setSubsectors([]);
    setSectorInfo(DEFAULT_SECTOR_INFO);
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
  }, []);

  useEffect(() => {
    const savedPassword = localStorage.getItem(PASSWORD_STORAGE_KEY);

    if (savedPassword) {
      login(savedPassword);
    }
  }, [login]);

  const save = useCallback(async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/database', {
        method: 'POST',
        headers: {
          'x-admin-password': password,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...sectorInfo,
          subsectors
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? 'No se pudo guardar.');
      }

      const refreshed = await readAdminData(password);
      hydrateData(refreshed);
      setMessage(`Guardado exitoso. Subsectores: ${payload?.subsectorCount ?? subsectors.length}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }, [hydrateData, password, sectorInfo, subsectors]);

  const updateSubsector = useCallback((subsectorId, field, value) => {
    setSubsectors((current) =>
      current.map((subsector) => (subsector.id === subsectorId ? { ...subsector, [field]: value } : subsector))
    );
  }, []);

  const addSubsector = useCallback(() => {
    const id = createId('subsector');
    const next = {
      id,
      name: 'Nuevo subsector',
      sector: 'Potrero Alto',
      description: '',
      image: '',
      routes: []
    };

    setSubsectors((current) => [...current, next]);
    return id;
  }, []);

  const removeSubsector = useCallback((subsectorId) => {
    setSubsectors((current) => current.filter((subsector) => subsector.id !== subsectorId));
  }, []);

  const updateRoute = useCallback((subsectorId, routeId, field, value) => {
    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        return {
          ...subsector,
          routes: (subsector.routes ?? []).map((route) => (route.id === routeId ? { ...route, [field]: value } : route))
        };
      })
    );
  }, []);

  const addRoute = useCallback((subsectorId) => {
    let createdRouteId = null;

    setSubsectors((current) =>
      current.map((subsector) => {
        if (subsector.id !== subsectorId) {
          return subsector;
        }

        const routeSector = routeSectorFromSubsectorId(subsectorId);
        const nextRouteNumber = String((subsector.routes ?? []).length + 1);
        const newRoute = { ...EMPTY_ROUTE, id: buildRouteId(routeSector, nextRouteNumber) };
        createdRouteId = newRoute.id;

        return { ...subsector, routes: [...(subsector.routes ?? []), newRoute] };
      })
    );

    return createdRouteId;
  }, []);

  const removeRoute = useCallback((subsectorId, routeId) => {
    setSubsectors((current) =>
      current.map((subsector) =>
        subsector.id === subsectorId
          ? { ...subsector, routes: (subsector.routes ?? []).filter((route) => route.id !== routeId) }
          : subsector
      )
    );
  }, []);

  const sectorOptions = useMemo(() => {
    const options = Array.from(new Set(subsectors.map((subsector) => String(subsector.sector ?? '').trim()).filter(Boolean)));

    return options.length ? options : ['Potrero Alto'];
  }, [subsectors]);

  return {
    authenticated,
    loading,
    saving,
    password,
    error,
    message,
    hasFeedback,
    sectorInfo,
    subsectors,
    sectorOptions,
    setSectorInfo,
    login,
    logout,
    save,
    updateSubsector,
    addSubsector,
    removeSubsector,
    updateRoute,
    addRoute,
    removeRoute
  };
}
