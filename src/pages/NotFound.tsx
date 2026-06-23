import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page paws-house-bg1 py-5 animate-fade-in">
      <div className="container">
        <div className="row block-padding align-items-center justify-content-center">
          <div className="col-md-5 text-center text-md-end mb-4 mb-md-0">
            <img 
              src="/static/img/services3.png" 
              alt="404 Dog Illustration" 
              className="img-fluid" 
              style={{ maxWidth: '240px' }}
            />
          </div>
          <div className="col-md-5 text-center text-md-start">
            <div className="p-4 p-md-5 rounded-4 shadow-sm bg-light border border-irregular1 d-inline-block w-100">
              <h1 className="display-3 font-weight-bold text-primary mb-1">404</h1>
              <h4 className="mb-4">Page not found</h4>
              <p className="text-secondary mb-4">
                Halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
              </p>
              <Link to="/" className="btn btn-primary px-4 py-2">
                Go back to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
