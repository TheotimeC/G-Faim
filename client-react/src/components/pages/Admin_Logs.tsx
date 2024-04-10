import '../assets/styles/adminlogs.css'; 
import api from '../assets/api';
import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const API_URL = 'http://localhost:3004/logs';

interface LogEntry {
    entityType: string;
    entityId: string;
    action: string;
    userId: string;
    description: string;
    timestamp: string; // ou Date selon comment vous gérez les dates
    additionalData: string;
    _id: string; // Pour `rowKey`
  }

export const getLogs = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.get(`${API_URL}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations:', error);
      throw error;
    }
  };

  const AdminLogs = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const parseDateString = (dateString) => {
        const [day, month, yearHour] = dateString.split('/');
        const [year, ...rest] = yearHour.split(' ');
        return new Date(`${month}/${day}/${year} ${rest.join(' ')}`);
      };
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get(API_URL, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                setLogs(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des informations:', error);
            }
        };
        fetchLogs();
    }, []);

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setFilterDropdownVisible(false);
      };
    
      const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
      };

    const columns = [
        {
            title: 'Type d\'entité',
            dataIndex: 'entityType',
            key: 'entityType',
            filters: [
                { text: 'RequestError', value: 'RequestError' },
                { text: 'Request', value: 'Request' },
            ],
            onFilter: (value:any, record:any) => record.entityType.indexOf(value) === 0,
            sorter: (a:any, b:any) => a.entityType.localeCompare(b.entityType),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            filters: [
                { text: 'PUT', value: 'PUT' },
                { text: 'GET', value: 'GET' },
                { text: 'DELETE', value: 'DELETE' },
                { text: 'POST', value: 'POST' },
                { text: 'LOGIN', value: 'LOGIN' },
            ],
            onFilter: (value:any, record:any) => record.action.indexOf(value) === 0,
            sorter: (a:any, b:any) => a.action.localeCompare(b.action),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            filters: [
                { text: 'Commande', value: 'orders' },
                { text: 'Authentification', value: 'auth' },
                { text: 'Restaurant', value: 'restaurant' },
                { text: 'Utilisateur', value: 'user' },
                { text: 'API Calls', value: 'dev' },
            ],
            onFilter: (value:any, record:any) => record.description.toLowerCase().includes(value),
        },
        {
            title: 'Utilisateur',
            dataIndex: 'userId',
            key: 'userId',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style={{ padding: 8 }}>
                <input
                  autoFocus
                  placeholder="Recherche par userId"
                  value={selectedKeys[0]}
                  onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                  onClick={() => handleSearch(selectedKeys, confirm)}
                  type="primary"
                  size="small"
                  style={{ width: 90, marginRight: 8 }}
                >
                  Rechercher
                </Button>
                <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                  Réinitialiser
                </Button>
              </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) => record.userId ? record.userId.toString().toLowerCase().includes(value.toLowerCase()) : false,
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setFilterDropdownVisible(visible);
              }
            },
          },
          {
            title: 'Date/Heure',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: timestamp => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style={{ padding: 8 }}>
                <DatePicker
                  onChange={(date) => setSelectedKeys(date ? [moment(date).format('YYYY-MM-DD')] : [])}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                  type="primary"
                  onClick={() => confirm()}
                  size="small"
                  style={{ width: 90, marginRight: 8 }}
                >
                  Filtrer
                </Button>
                <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                  Réinitialiser
                </Button>
              </div>
            ),
            onFilter: (value, record) => {
              const selectedDate = moment(value).format('YYYY-MM-DD');
              const recordDate = moment(record.timestamp).format('YYYY-MM-DD');
              console.log("recordDate",recordDate)
              console.log("selectedDate",selectedDate)
              return recordDate === selectedDate;
            },
          },
    ];

    return (
        <div className="admin-logs">
            <h1>Logs d'activité</h1>
            <Table columns={columns} dataSource={logs} rowKey={record => record._id} />
        </div>
    );
};


export default AdminLogs