import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import './PackageForm.css';
import { useToast } from './ToastProvider';

const PackageForm = ({ token }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [priceCustom, setPriceCustom] = useState('');
  const [priceCustom2, setPriceCustom2] = useState('');
  const [priceCustom3, setPriceCustom3] = useState('');
  const [priceCustom4, setPriceCustom4] = useState('');
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
        setPriceCustom(pkg.priceCustom != null ? String(pkg.priceCustom) : '');
        setPriceCustom2(pkg.priceCustom2 != null ? String(pkg.priceCustom2) : '');
        setPriceCustom3(pkg.priceCustom3 != null ? String(pkg.priceCustom3) : '');
        setPriceCustom4(pkg.priceCustom4 != null ? String(pkg.priceCustom4) : '');
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

  // modalidad eliminada

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('priceCustom', priceCustom);
    formData.append('priceCustom2', priceCustom2);
    formData.append('priceCustom3', priceCustom3);
    formData.append('priceCustom4', priceCustom4);
    formData.append('currency', currency);

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
        await api.put(`/packages/${id}`, formData);
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
        await api.post('/packages', formData);
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
            <label className="form-label">Precio</label>
            <input type='text' className='form-control' placeholder='Ej: 1200 USD por persona' value={priceCustom} onChange={(e) => setPriceCustom(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Precio 2</label>
            <input type='text' className='form-control' placeholder='Otro precio (texto libre)' value={priceCustom2} onChange={(e) => setPriceCustom2(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Precio 3</label>
            <input type='text' className='form-control' placeholder='Otro precio (texto libre)' value={priceCustom3} onChange={(e) => setPriceCustom3(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Precio 4</label>
            <input type='text' className='form-control' placeholder='Otro precio (texto libre)' value={priceCustom4} onChange={(e) => setPriceCustom4(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fecha</label>
            <input type='text' className='form-control' placeholder='Ej: Enero 2025 o fechas a consultar' value={duration} onChange={(e) => setDuration(e.target.value)} />
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