var React = require('react');
var PropTypes = require('prop-types');
var api = require('../utils/api')

function SelectLanguage (props) {
  var languages = ['All', 'Javascript', 'Ruby', 'Java', 'CSS', 'Python'];
  return (
    <ul className='languages'>
      {/* <p>Selected Language: {this.state.selectedLanguage}</p> */}
      {languages.map(function(lang){
        return (
          <li 
            style={lang === props.selectedLanguage ? { color: '#d0021b'} : null}
            onClick={props.onSelect.bind(null, lang)}
            key={lang}
          >
            {lang}
          </li>
        )
      }, this)}
    </ul>
  )
}
SelectLanguage.propTypes = {
  selectedLanguage : PropTypes.string.isRequired, 
  onSelect: PropTypes.func.isRequired
}


function RepoGrid(props){
  return(
    <ul className="popular-list">
      {props.repos.map(function(repo, index){
        return(
          <li 
            key={repo.name} 
            className="popular-item"
          >
            <div className="poular-rank">#{index + 1}</div>
            <ul className="space-list-items">
              <li>
                <img 
                  src={repo.owner.avatar_url} 
                  alt={'Avatar for ' + repo.owner.login} 
                  className="avatar"
                />
              </li>
              <li><a href={repo.html_url}>{repo.name}</a></li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        )
        
      })}
    </ul>
  )
}

RepoGrid.propTypes = {
  repos: PropTypes.array.isRequired
}

// The three essential features of a component
// 1) state
// 2) lifecycle events
// 3) ui
class Popular extends React.Component {  
  constructor(props){
    super(props);
    this.state = {
      selectedLanguage: 'All',
      repos: null
    };

    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount(){
    // AJAX Requests
    this.updateLanguage(this.state.selectedLanguage)
  }

  updateLanguage(lang) {
    this.setState(function(){
      return {
        selectedLanguage: lang,
        repos: null
      }
    });

    api.fetchPopularRepos(lang)
      .then(function(repos){
        this.setState(function(){
          return {
            repos: repos
          }
        })
      }.bind(this));
  }
  render(){    
    return (
      <div>
        <SelectLanguage 
          selectedLanguage={this.state.selectedLanguage}
          onSelect={this.updateLanguage}
        />
        {/* {JSON.stringify(this.state.repos, null, 2)} */}
        {
          !this.state.repos
          ? <p>Loading</p>
          : <RepoGrid repos={this.state.repos} /> 
        }
       
      </div>
    )
  }
}

module.exports = Popular;