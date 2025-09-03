'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { API_CONFIG } from '@/lib/api';

export function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [backendInfo, setBackendInfo] = useState<string | null>(null);

  const checkConnection = async () => {
    setConnectionStatus('checking');

    try {
      console.log(`🔍 Testando conectividade com backend...`);
      console.log(`📍 Frontend rodando em: ${window.location.origin}`);
      console.log(`🎯 Backend URL: ${API_CONFIG.baseURL}`);

      // Primeiro: Testar OPTIONS (preflight) para verificar CORS
      console.log(`🔍 Testando CORS preflight (OPTIONS)...`);
      try {
        const optionsResponse = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type',
          },
        });

        console.log(`📡 OPTIONS Response:`, {
          status: optionsResponse.status,
          headers: Object.fromEntries(optionsResponse.headers.entries())
        });

        if (optionsResponse.ok) {
          console.log(`✅ CORS preflight OK - Status: ${optionsResponse.status}`);
        }
      } catch (optionsError) {
        console.log(`⚠️ OPTIONS request falhou:`, optionsError);
      }

      // Segundo: Testar GET simples
      console.log(`🔍 Testando GET request...`);
      let response;
      try {
        response = await fetch(`${API_CONFIG.baseURL}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        console.log(`📡 GET Response:`, {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (response.ok || response.status === 404) {
          setConnectionStatus('connected');
          setBackendInfo(`✅ Backend acessível via GET (Status: ${response.status})`);
          console.log(`✅ Backend conectado via GET - Status: ${response.status}`);
          return;
        }
      } catch (getError) {
        console.log(`⚠️ GET request falhou:`, getError);
      }

      // Terceiro: Testar POST (o que realmente importa)
      console.log(`🔍 Testando POST request...`);
      response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });

      console.log(`📡 POST Response:`, {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Se chegou até aqui, o CORS está funcionando
      if (response.status === 400 || response.status === 401 || response.status === 200) {
        setConnectionStatus('connected');
        setBackendInfo(`✅ CORS funcionando! Backend respondeu via POST (Status: ${response.status})`);
        console.log(`✅ CORS OK! Backend conectado via POST - Status: ${response.status}`);
      } else {
        setConnectionStatus('disconnected');
        setBackendInfo(`⚠️ Status inesperado: ${response.status}`);
        console.log(`⚠️ Status inesperado: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('❌ Erro na verificação:', errorMessage);

      // Detectar erro CORS específico
      if (errorMessage.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
        setBackendInfo(`❌ Erro CORS: Verifique se app.UseCors("AllowFrontend") está configurado no backend`);
      } else if (errorMessage.includes('CORS')) {
        setConnectionStatus('disconnected');
        setBackendInfo(`❌ Erro CORS: ${errorMessage}`);
      } else {
        setConnectionStatus('disconnected');
        setBackendInfo(`❌ Erro: ${errorMessage}`);
      }
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
                <p>❌ <strong>Problema de conectividade</strong></p>

                {backendInfo?.includes('CORS') ? (
                  <div className="bg-red-900/20 border border-red-700 p-3 rounded mt-2">
                    <p className="text-red-300 font-medium">🚫 Erro CORS Detectado</p>
                    <p className="mt-1">⚠️ <strong>Importante:</strong> Este erro só acontece no navegador, não no Postman!</p>
                    <p className="text-sm mt-2">O backend funciona, mas precisa configurar CORS para aceitar requests do frontend.</p>

                    <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-600 rounded">
                      <p className="text-yellow-300 font-medium text-xs">🔧 Verificar Pipeline do Backend:</p>
                      <p className="text-xs mt-1">Certifique-se que o CORS está sendo aplicado no Program.cs:</p>
                      <pre className="text-xs mt-1 bg-slate-800 p-2 rounded overflow-x-auto">
{`// Depois de builder.Services.AddCors(...)
app.UseCors("AllowFrontend");

// OU para desenvolvimento:
app.UseCors("AllowAll");`}
                      </pre>
                      <p className="text-xs mt-2 text-yellow-200">⚠️ O UseCors() deve vir ANTES de UseAuthorization()</p>
                    </div>

                    <details className="mt-2">
                      <summary className="text-yellow-300 text-xs cursor-pointer">📋 Configuração detalhada para produção</summary>
                      <ul className="ml-4 space-y-1 text-xs mt-2">
                        <li>• Origem específica: <code className="bg-slate-800 px-1 rounded">http://localhost:3001</code></li>
                        <li>• Métodos: GET, POST, PUT, DELETE, OPTIONS</li>
                        <li>• Headers: Content-Type, Authorization</li>
                        <li>• Suporte a preflight (OPTIONS)</li>
                      </ul>
                    </details>
                  </div>
                ) : (
                  <div>
                    <p>Verifique se:</p>
                    <ul className="ml-4 space-y-1">
                      <li>• O backend está rodando na porta 5134</li>
                      <li>• A URL {API_CONFIG.baseURL} está correta</li>
                      <li>• O endpoint /auth/login existe</li>
                      <li>• Não há firewall bloqueando a conexão</li>
                    </ul>
                  </div>
                )}

                <div className="mt-3 p-2 bg-blue-900/20 border border-blue-600 rounded">
                  <p className="text-blue-300 font-medium text-xs">ℹ️ Por que funciona no Postman mas não no navegador?</p>
                  <ul className="text-xs mt-1 space-y-1">
                    <li>• <strong>Postman:</strong> Não implementa políticas CORS</li>
                    <li>• <strong>Navegador:</strong> Bloqueia requests entre origens diferentes</li>
                    <li>• <strong>Preflight:</strong> Navegador envia OPTIONS antes de POST com JSON</li>
                  </ul>
                </div>

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
