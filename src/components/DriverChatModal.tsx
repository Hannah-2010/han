import React, { useState } from 'react';
import { X, Send, Phone, User, CheckCheck } from 'lucide-react';
import { Driver, ChatMessage } from '../types/ride';

interface DriverChatModalProps {
  driver: Driver;
  onClose: () => void;
  onCall: () => void;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({
  driver,
  onClose,
  onCall,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Chào bạn nhé! Mình là Trí, khoảng 07:25 mình có mặt trước sảnh BA4 KTX B nha.',
      timestamp: '07:15',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Dạ em chào anh, em đứng sẵn trước sảnh mặc áo khoác đỏ nhé anh.',
      timestamp: '07:16',
    },
    {
      id: 'm3',
      sender: 'driver',
      text: 'Ok bạn, xe mình Toyota Vios màu trắng biển 51F-882.14 bật xi nhan chờ nha!',
      timestamp: '07:17',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'Em đang đứng ở sảnh rồi ạ!',
    'Anh tới cứ nhá máy em nhé',
    'Cốp xe còn chỗ để balo không anh?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated driver response after 1.2s
    setTimeout(() => {
      const driverReplies = [
        'Dạ ok bạn, mình đang chạy gần tới cổng rồi nè!',
        'Nhất trí nha, xe máy lạnh mát rượi cứ yên tâm.',
        'Ok bạn, 2 phút nữa xe tới nha.',
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: `m-driver-${Date.now()}`,
          sender: 'driver',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl h-[80vh] max-h-[640px] shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-red-600 text-white">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 overflow-hidden border border-white/30 flex items-center justify-center">
              <img 
                src={driver.avatar} 
                alt={driver.name}
                className="h-full w-full object-cover" 
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="text-xs font-bold">{driver.name[0]}</span>
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">{driver.name}</h2>
              <p className="text-[11px] text-rose-100">{driver.vehicle.model} · {driver.vehicle.licensePlate}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onCall}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="Gọi tài xế"
            >
              <Phone className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-red-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                {m.timestamp}
                {m.sender === 'user' && <CheckCheck className="h-3 w-3 text-red-500" />}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleSend(reply)}
              className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-red-50 hover:text-red-700 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhắn tin cho tài xế..."
            className="flex-1 px-4 py-2.5 text-xs rounded-2xl bg-slate-100 border border-transparent focus:bg-white focus:border-red-500 focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white flex items-center justify-center transition-all flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
