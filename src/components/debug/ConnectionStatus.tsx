'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { API_CONFIG } from '@/lib/api';

export function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [backendInfo, setBackendInfo] = useState<any>(null);

  const checkConnection = async () => {
    setConnectionStatus('checking');

    try {
      // Testar apenas o endpoint de login que sabemos que existe
      console.log(`🔍 Testando conectividade com backend...`);

      const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });

      // Se chegou até aqui, o backend está respondendo (mesmo que seja erro 400/401)
      if (response.status === 400 || response.status === 401 || response.status === 200) {
        setConnectionStatus('connected');
        setBackendInfo(`Backend respondendo (Status: ${response.status})`);
        console.log(`✅ Backend conectado - Status: ${response.status}`);
      } else {
        setConnectionStatus('disconnected');
        setBackendInfo(`Status inesperado: ${response.status}`);
        console.log(`⚠️ Status inesperado: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Erro na verificação:', error.message);
      setConnectionStatus('disconnected');
      setBackendInfo(null);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-400';
      case 'disconnected':
        return 'text-red-400';
      case 'checking':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢';
      case 'disconnected':
        return '🔴';
      case 'checking':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      case 'checking':
        return 'Verificando...';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🌐 Status da Conexão
          <span className={getStatusColor()}>
            {getStatusIcon()} {getStatusText()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Atual */}
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <span className="text-gray-400">URL da API:</span>
            <span className="ml-2 text-white text-xs break-all">
              {API_CONFIG.baseURL}
            </span>
          </div>
        </div>

        {/* Informações do Backend */}
        {backendInfo && (
          <div className="bg-slate-900 p-3 rounded">
            <h4 className="text-white font-medium mb-2">Resposta do Backend:</h4>
            <pre className="text-xs text-gray-300 overflow-x-auto">
              {typeof backendInfo === 'string' 
                ? backendInfo 
                : JSON.stringify(backendInfo, null, 2)
              }
            </pre>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={checkConnection}
            disabled={connectionStatus === 'checking'}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            {connectionStatus === 'checking' ? 'Verificando...' : 'Testar Conexão'}
          </Button>
        </div>

        {/* Instruções */}
        <div className="text-sm text-gray-400 bg-slate-900 p-3 rounded">
          <h4 className="font-medium text-white mb-2">💡 Instruções:</h4>

          <div className="space-y-2">
            {connectionStatus === 'connected' ? (
              <p>✅ <strong>Backend conectado</strong> - Você pode usar o sistema normalmente</p>
            ) : (
              <div>
                <p>❌ <strong>Backend não encontrado</strong></p>
                <p>Verifique se:</p>
                <ul className="ml-4 space-y-1">
                  <li>• O backend está rodando na porta 5134</li>
                  <li>• A URL {API_CONFIG.baseURL} está correta</li>
                  <li>• Não há problemas de CORS</li>
                  <li>• O endpoint /auth/login existe e retorna a estrutura esperada</li>
                </ul>
                <p className="text-blue-400 mt-2">
                  💡 Use o comando: <code className="bg-slate-800 px-1 rounded">npm run check-backend</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
