import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function Profile() {
    const history = useHistory();
    const [incidents, setIncidents] = useState([])

    const ngoId = localStorage.getItem('ngoId')
    const ngoName = localStorage.getItem('ngoName')

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: ngoId,
            }
        }).then(response => {
            setIncidents(response.data)
        })
    }, [ngoId]);

    const handleDeleteIncident = async (id) => {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ngoId,
                }
            });
            setIncidents(incidents.filter(incident => incident.id !== id));
        } catch (error) {
            alert('Erro ao deletar caso, tente novamente');

        };
    };

    const handleLogout = () => {
        localStorage.clear();
        history.push('/');
    };

    return (
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem-vindo, {ngoName}</span>
                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>
            <h1>Casos cadastrados</h1>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>
                        <strong>{incident.description}</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>
                        <button type="button" onClick={() => handleDeleteIncident(incident.id)}>
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}

            </ul>
        </div>
    )
};