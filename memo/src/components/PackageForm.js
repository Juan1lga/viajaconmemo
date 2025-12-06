import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import './PackageForm.css';
import { useToast } from './ToastProvider';

const PackageForm = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  // nuevos campos
  const [currency, setCurrency] = useState('USD');
  const [priceDouble, setPriceDouble] = useState('');
  const [priceChild, setPriceChild] = useState('');
  const [priceAdult, setPriceAdult] = useState('');
  const [priceDoubleLabel, setPriceDoubleLabel] = useState('Base doble');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Populares');
  const [includesInput, setIncludesInput] = useState('');
  const [popular, setPopular] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (id) {
      const fetchPackage = async () => {
      const res = await api.get(`/packages/${id}`);
        const pkg = res.data;
        setName(pkg.name);
        setDescription(pkg.description);
        setPrice(pkg.price);
        setImage(pkg.image);
        setDuration(pkg.duration || '');
        setCategory((pkg.category === 'Popular' || pkg.category === 'Populares' || pkg.category === 'Lujo' || pkg.category === 'Económicos' || pkg.category === 'Ofertas de fin de semana') ? (pkg.category === 'Popular' ? 'Populares' : pkg.category) : 'Populares');
        setIncludesInput(Array.isArray(pkg.includes) ? pkg.includes.join(', ') : (pkg.includes || ''));
        setPopular(Boolean(pkg.popular));
        setCurrency((pkg.currency === 'MXN' || pkg.currency === 'USD') ? pkg.currency : 'USD');
        setPriceDouble(pkg.priceDouble != null ? String(pkg.priceDouble) : '');
        setPriceChild(pkg.priceChild != null ? String(pkg.priceChild) : '');
        setPriceAdult(pkg.priceAdult != null ? String(pkg.priceAdult) : '');
        setPriceDoubleLabel((typeof pkg.priceDoubleLabel === 'string' && pkg.priceDoubleLabel.trim()) ? pkg.priceDoubleLabel : 'Base doble');
        try {
          const sd = pkg.startDate ? new Date(pkg.startDate) : null;
          const ed = pkg.endDate ? new Date(pkg.endDate) : null;
          const toInput = (d) => d ? new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10) : '';
          setStartDate(sd ? toInput(sd) : '');
          setEndDate(ed ? toInput(ed) : '');
        } catch (_) {}

      };
      fetchPackage();
    }
  }, [id]);

  const modality = priceDoubleLabel || 'Base doble';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('currency', currency);
    formData.append('priceDouble', priceDouble);
    formData.append('priceChild', priceChild);
    formData.append('priceAdult', priceAdult);
    formData.append('priceDoubleLabel', priceDoubleLabel);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('duration', duration);
    formData.append('category', category);
    formData.append('includes', includesInput);
    formData.append('popular', popular);
    formData.append('itinerary', description);

    if (id) {
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (image) {
        formData.append('image', image);
      }
      try {
        await api.put(`/packages/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        showSuccess('Paquete actualizado con éxito');
        navigate('/admin');
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.msg || 'Error al actualizar el paquete';
        showError(msg);
      }
    } else {
      if (!imageFile && !image) {
        showError('Por favor selecciona una imagen o indica la URL de la imagen.');
        return;
      }
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (image) {
        formData.append('image', image);
      }
      try {
        await api.post('/packages', formData, { headers: { "Content-Type": "multipart/form-data" } });
        showSuccess('Paquete creado con éxito');
        navigate('/admin');
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.msg || 'Error al crear el paquete';
        showError(msg);
      }
    }
  };

  return (
    <div className='package-form'>
      <form onSubmit={handleSubmit} className="container p-3">
        <h2>{id ? 'Editar' : 'Nuevo'} Paquete</h2>
        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input type='text' className='form-control' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Moneda</label>
            <select className='form-select' value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value='USD'>USD (Dólares)</option>
              <option value='MXN'>MXN (Pesos mexicanos)</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Precio general</label>
            <input type='number' className='form-control' placeholder='Precio' value={price} onChange={(e) => setPrice(e.target.value)} step='0.01' min='0' />
          </div>
          <div className="col-md-6">
            <label className="form-label">{`Precio ${modality}`}</label>
            <input type='number' className='form-control' placeholder={`Precio ${modality}`} value={priceDouble} onChange={(e) => setPriceDouble(e.target.value)} step='0.01' min='0' />
          </div>
          <div className="col-md-6">
            <label className="form-label">Precio para niños</label>
            <input type='number' className='form-control' placeholder='Precio niños' value={priceChild} onChange={(e) => setPriceChild(e.target.value)} step='0.01' min='0' />
          </div>
           <div className="col-md-6">
            <label className="form-label">Modalidad de pago</label>
            <select className='form-select' value={priceDoubleLabel} onChange={(e) => setPriceDoubleLabel(e.target.value)}>
              <option value='Base sencilla'>Base sencilla</option>
              <option value='Base doble'>Base doble</option>
              <option value='Base triple'>Base triple</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Precio para adultos</label>
            <input type='number' className='form-control' placeholder='Precio adultos' value={priceAdult} onChange={(e) => setPriceAdult(e.target.value)} step='0.01' min='0' />
          </div>
          <div className="col-md-6">
            <label className="form-label">Duración</label>
            <input type='text' className='form-control' placeholder='Ej: 7 días' value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Categoría</label>
            <select className='form-select' value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value='Populares'>Populares</option>
              <option value='Lujo'>Lujo</option>
              <option value='Económicos'>Económicos</option>
              <option value='Ofertas de fin de semana'>Ofertas de fin de semana</option>
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Itinerario</label>
            <textarea className='form-control' placeholder='Describe el itinerario detallado' value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}></textarea>
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha inicio</label>
            <input type='date' className='form-control' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha fin</label>
            <input type='date' className='form-control' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">URL de la Imagen</label>
            <input type='text' className='form-control' placeholder='http://...' value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Imagen (archivo)</label>
            <input type='file' name='image' className='form-control' accept='image/*' onChange={(e) => setImageFile(e.target.files[0] || null)} required={!id && !image} />
          </div>
          <div className="col-12">
            <label className="form-label">Elementos Incluidos (separados por coma)</label>
            <input type='text' className='form-control' placeholder='Ej: Vuelos, Hotel, Comidas' value={includesInput} onChange={(e) => setIncludesInput(e.target.value)} />
          </div>
          <div className="col-12 form-check">
            <input className='form-check-input' type='checkbox' id='popularCheck' checked={popular} onChange={(e) => setPopular(e.target.checked)} />
            <label className='form-check-label' htmlFor='popularCheck'>Marcar como popular</label>
          </div>
        </div>
        <div className="d-flex gap-2 mt-4">
          <button type='button' className='btn btn-secondary' onClick={() => navigate('/admin')}>Cancelar</button>
          <button type='submit' className='btn btn-success'>{id ? 'Guardar Cambios' : 'Guardar Paquete'}</button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;