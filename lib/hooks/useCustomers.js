// lib/hooks/useCustomers.ts
import { useEffect, useState } from 'react';
import { getAllCustomers, getCustomerByPhone } from '../firebase/firestore';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllCustomers();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, loading, error };
};

export const useCustomerByPhone = (phone) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!phone) {
      setLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await getCustomerByPhone(phone);
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [phone]);

  return { customer, loading, error };
};
