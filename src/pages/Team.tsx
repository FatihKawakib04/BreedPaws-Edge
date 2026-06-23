import { Link } from 'react-router-dom';

interface TeamMember {
  name: string;
  nim: string;
  photo: string;
  email: string;
  tiktok: string;
  instagram: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Fatih Kawakib Kartono',
    nim: 'J0403221073',
    photo: '/static/img/team/fatih-photo.png',
    email: 'mailto:kwkbkartono@gmail.com',
    tiktok: 'https://www.tiktok.com/@lalalaangit?_t=ZS-8wBdxQuZkjA&_r=1',
    instagram: 'https://www.instagram.com/kwakibk/',
  },
  {
    name: 'Najla Amelia',
    nim: 'J0403221089',
    photo: '/static/img/team/najla-photo.jpg',
    email: 'mailto:najlamelia@apps.ipb.ac.id',
    tiktok: '#',
    instagram: 'https://www.instagram.com/najlameliap/',
  },
  {
    name: 'M Yordi Septian',
    nim: 'J0403221020',
    photo: '/static/img/team/yordi-photo.JPG',
    email: 'mailto:yordiseptian1309@gmail.com',
    tiktok: 'https://www.tiktok.com/@yordisptn_?_t=ZS-8wBe73HEUhl&_r=1',
    instagram: 'http://instagram.com/yordisptn_/',
  }
];

function Team() {
  return (
    <div className="page team-page">
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading">
            <h1>Our Team</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Team</li>
            </ol>
          </nav>
        </div>
      </div>
      {/* /jumbotron */}

      {/* Page Content */}
      <div className="container block-padding">
        <div className="text-center mb-5">
          <h3>Team Hore!</h3>
          <p className="subtitle text-muted">
            Anggota tim pengembang BreedPaws yang berdedikasi untuk meningkatkan kesejahteraan anjing melalui teknologi AI.
          </p>
        </div>

        <div className="row justify-content-center">
          {teamMembers.map((member, index) => (
            <div key={index} className="col-sm-10 col-md-6 col-lg-4 mb-4">
              <div className="team-style1 border-0 shadow-sm">
                <div className="team-image">
                  <img src={member.photo} alt={member.name} />
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <h6 className="text-primary">{member.nim}</h6>
                </div>
                <ul className="social">
                  <li>
                    <a href={member.email} title="Email">
                      <i className="fa fa-envelope"></i>
                    </a>
                  </li>
                  {member.tiktok !== '#' && (
                    <li>
                      <a href={member.tiktok} target="_blank" rel="noopener noreferrer" title="TikTok">
                        <i className="fab fa-tiktok"></i>
                      </a>
                    </li>
                  )}
                  <li>
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Team;
