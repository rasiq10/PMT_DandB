import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './PMTSchedule.css';
import { supabase } from '../supabaseclient';

function excelDateToJSDate(serial) {
  const utc_days = serial - 25569;
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  const year = date_info.getUTCFullYear();
  const month = (date_info.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date_info.getUTCDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function PMTSchedule() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [pmtByDate, setPmtByDate] = useState({});

  // Fetch PMTs from Supabase
  useEffect(() => {
    fetchPMTs();
  }, []);

  async function fetchPMTs() {
    const { data, error } = await supabase
      .from('PMT')
      .select('date, game')
      .order('date', { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    const byDate = {};
    data.forEach((row) => {
      const dateStr = row.date;
      if (!byDate[dateStr]) byDate[dateStr] = [];
      byDate[dateStr].push(row.game);
    });
    setPmtByDate(byDate);
  }

  // Admin passcode check
  async function handlePasscodeSubmit(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('passcode', passcodeInput)
      .limit(1)
      .single();

    if (error || !data) {
      alert('Incorrect passcode');
      return;
    }

    setIsAdmin(true);
    setPasscodeInput('');
  }

  
  // Handle Excel upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const rows = [];
      json.forEach((row) => {
        if (!row.Date || !row.Game) return;
        const dateStr =
          typeof row.Date === 'number' ? excelDateToJSDate(row.Date) : row.Date;
        rows.push({ date: dateStr, game: row.Game.trim() });
      });

      // Insert into Supabase
      const { error } = await supabase.from('PMT').insert(rows);

      if (error) {
        console.error(error);
        alert('Upload failed.');
      } else {
        alert('PMTs uploaded successfully!');
        fetchPMTs();
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const formatDate = (date) => date.toISOString().split('T')[0];
  const tasks = pmtByDate[formatDate(selectedDate)] || [];

  // Non-admin view (only view PMTs)
  if (!isAdmin) {
  return (
    <div className="non-admin-container">
      <div className="passcode-wrapper">
        <h2>Enter Admin Passcode to Upload PMTs</h2>
        <form onSubmit={handlePasscodeSubmit}>
          <input
            type="password"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            placeholder="Passcode"
            className="passcode-input"
          />
          <button type="submit" className="passcode-button">
            Submit
          </button>
        </form>
      </div>

      <p className="non-admin-info">Non-admins can view PMTs below.</p>

      <div className="pmt-container">
        <div className="pmt-content">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date, view }) =>
              view === 'month' && pmtByDate[formatDate(date)]
                ? 'react-calendar__tile--has-tasks'
                : null
            }
          />
          <div className="pmt-tasks">
            <h2>Tasks for {selectedDate.toDateString()}</h2>
            {tasks.length > 0 ? (
              <ul>
                {tasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            ) : (
              <p>No PMTs scheduled for this day.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



  // Admin view (upload + view)
  return (
    <div className="pmt-container">
      <h1 className="pmt-title">PMT Schedule</h1>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <div className="pmt-content">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={({ date, view }) =>
            view === 'month' && pmtByDate[formatDate(date)]
              ? 'react-calendar__tile--has-tasks'
              : null
          }
        />

        <div className="pmt-tasks">
          <h2>Tasks for {selectedDate.toDateString()}</h2>
          {tasks.length > 0 ? (
            <ul>
              {tasks.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ul>
          ) : (
            <p>No PMTs scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
}
