import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    title: 'Intelligent Document Processing System',
    description: 'A production ML pipeline for extracting and classifying information from unstructured documents using NLP and computer vision.',
    tech: ['Python', 'TensorFlow', 'AWS SageMaker', 'Docker'],
    github: 'https://github.com/jagdishkumarpatel/doc-processor',
  },
  {
    title: 'MLOps Platform for Model Deployment',
    description: 'Built a scalable MLOps platform enabling automated model training, testing, and deployment with monitoring and A/B testing capabilities.',
    tech: ['Kubernetes', 'MLflow', 'Azure', 'Python'],
    github: 'https://github.com/jagdishkumarpatel/mlops-platform',
  },
  {
    title: 'Real-time Recommendation Engine',
    description: 'Developed a high-performance recommendation system using collaborative filtering and deep learning, serving personalized content to millions of users.',
    tech: ['PyTorch', 'Redis', 'GCP', 'Node.js'],
    github: 'https://github.com/jagdishkumarpatel/recommendation-engine',
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">My Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Github size={16} />
                  View on GitHub
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}