import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gitService } from '../../../services/gitService';
import { documentService } from '../../../services/documentService';
import { RepositoryTreeEntryResponse } from '../../../proto/repositories';
import './AddAndBuild.css';

const AddAndBuild: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Data Selection
    const [selectedRepo, setSelectedRepo] = useState<{ id: number; name: string } | null>(null);
    const [selectedRef, setSelectedRef] = useState<string>('');
    const [confPath, setConfPath] = useState<string>('');
    const [docTitle, setDocTitle] = useState<string>('');

    // Step Data
    const [repositories, setRepositories] = useState<any[]>([]);
    const [refs, setRefs] = useState<{ branches: string[], tags: string[] }>({ branches: [], tags: [] });
    
    // Tree browser
    const [currentPath, setCurrentPath] = useState('');
    const [treeEntries, setTreeEntries] = useState<RepositoryTreeEntryResponse[]>([]);

    // Step 1: Load Repos
    useEffect(() => {
        if (step === 1) {
            setLoading(true);
            gitService.listRepositories()
                .then(data => setRepositories(data.repositories))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [step]);

    // Step 2: Load Refs
    useEffect(() => {
        if (step === 2 && selectedRepo) {
            setLoading(true);
            gitService.listRefs(selectedRepo.id)
                .then(data => setRefs(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [step, selectedRepo]);

    // Step 3: Load Tree
    useEffect(() => {
        if (step === 3 && selectedRepo) {
            loadTree(currentPath);
        }
    }, [step, selectedRepo, currentPath]); // Trigger on currentPath change

    const loadTree = (path: string) => {
        if (!selectedRepo) return;
        setLoading(true);
        gitService.listTree(selectedRepo.id, selectedRef, path)
            .then(data => setTreeEntries(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    const handleRepoSelect = (repo: any) => {
        setSelectedRepo(repo);
    };

    const handleRefSelect = (ref: string) => {
        setSelectedRef(ref);
    };

    const handleTreeDirectoryClick = (dir: string) => {
        setCurrentPath(dir); // The API returns full path, e.g. "subdir" or "subdir/nested"
    };

    const handleTreeFileClick = (file: string) => {
        // file is full path potentially
        setConfPath(file);
    };

    const handleUpDirectory = () => {
        if (!currentPath) return;
        const parts = currentPath.split('/');
        parts.pop();
        setCurrentPath(parts.join('/'));
    }

    const handleSubmit = async () => {
        if (!selectedRepo || !selectedRef || !confPath || !docTitle) {
            setError("Please fill all fields.");
            return;
        }

        setLoading(true);
        try {
            await documentService.createAndStartBuild({
                title: docTitle,
                source: selectedRepo.id,
                reference: selectedRef,
                workdir: '.', // Defaulting for now
                confPath: confPath,
                startImmediately: true
            });
            navigate('/documents');
        } catch (err: any) {
            setError("Failed to start build: " + err.message);
            setLoading(false);
        }
    };

    const nextStep = () => {
        setError(null);
        setStep(s => s + 1);
    };

    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="add-build-container">
            <h1 className="wizard-title">Create New Document Build</h1>

            <div className="wizard-steps">
                <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
                <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
                <div className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3</div>
                <div className={`step-indicator ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>4</div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {loading && <div>Loading...</div>}

            <div className="wizard-content">
                {step === 1 && (
                    <div>
                        <h2>Select Repository</h2>
                        <div className="list-group">
                            {repositories.map(repo => (
                                <div 
                                    key={repo.id} 
                                    className={`list-item ${selectedRepo?.id === repo.id ? 'selected' : ''}`}
                                    onClick={() => handleRepoSelect(repo)}
                                >
                                    {repo.name} <small>({repo.organisationId})</small>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2>Select Reference</h2>
                        <h3>Branches</h3>
                        <div className="list-group">
                            {refs.branches.map(branch => (
                                <div 
                                    key={branch} 
                                    className={`list-item ${selectedRef === branch ? 'selected' : ''}`}
                                    onClick={() => handleRefSelect(branch)}
                                >
                                    {branch}
                                </div>
                            ))}
                        </div>
                        <h3>Tags</h3>
                         <div className="list-group">
                            {refs.tags.map(tag => (
                                <div 
                                    key={tag} 
                                    className={`list-item ${selectedRef === tag ? 'selected' : ''}`}
                                    onClick={() => handleRefSelect(tag)}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2>Select Configuration File (conf.py)</h2>
                        <p>Current Path: /{currentPath}</p>
                        {currentPath && (
                            <button className="btn btn-secondary" style={{marginBottom: '10px'}} onClick={handleUpDirectory}>
                                Up ..
                            </button>
                        )}
                        <div className="list-group">
                            {treeEntries.map(entry => (
                                <div 
                                    key={entry.path} 
                                    className={`list-item ${entry.type === 'blob' && confPath === entry.path ? 'selected' : ''}`}
                                    onClick={() => entry.type === 'tree' ? handleTreeDirectoryClick(entry.path) : handleTreeFileClick(entry.path)}
                                >
                                    {entry.type === 'tree' ? '📁' : '📄'} {entry.name}
                                </div>
                            ))}
                        </div>
                        {confPath && <p>Selected: <strong>{confPath}</strong></p>}
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2>Review & Start</h2>
                        <div className="form-group">
                            <label className="form-label">Document Title</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                value={docTitle} 
                                onChange={e => setDocTitle(e.target.value)}
                                placeholder="My Documentation"
                            />
                        </div>
                        <div className="review-details">
                            <p><strong>Repository:</strong> {selectedRepo?.name}</p>
                            <p><strong>Reference:</strong> {selectedRef}</p>
                            <p><strong>Configuration Path:</strong> {confPath}</p>
                        </div>
                    </div>
                )}

                <div className="button-group">
                    {step > 1 && (
                        <button className="btn btn-secondary" onClick={prevStep} disabled={loading}>
                            Previous
                        </button>
                    )}
                    {step < 4 && (
                        <button 
                            className="btn btn-primary" 
                            onClick={nextStep} 
                            disabled={loading || (step === 1 && !selectedRepo) || (step === 2 && !selectedRef) || (step === 3 && !confPath)}
                        >
                            Next
                        </button>
                    )}
                    {step === 4 && (
                        <button 
                            className="btn btn-primary" 
                            onClick={handleSubmit} 
                            disabled={loading || !docTitle}
                        >
                            Build & Create
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddAndBuild;
