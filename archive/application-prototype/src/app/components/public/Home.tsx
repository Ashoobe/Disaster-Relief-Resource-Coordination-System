import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Shield, 
  Clock, 
  Users, 
  Heart, 
  ArrowRight,
  Droplets,
  Flame,
  Wind,
  Home as HomeIcon,
  Phone,
  AlertCircle
} from 'lucide-react';

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Rapid Response When Disaster Strikes
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                We provide coordinated emergency relief and support to communities affected by natural disasters. 
                Available 24/7 to respond to your emergency needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/submit-request" className="flex items-center gap-2">
                    <AlertCircle className="size-5" />
                    Submit Emergency Request
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNhc3RlciUyMHJlbGllZiUyMGh1bWFuaXRhcmlhbiUyMGFpZHxlbnwxfHx8fDE3NzIwNjAxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Disaster relief workers"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Clock className="size-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Emergency Response</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-green-100 text-green-600 rounded-full mb-4">
                <Users className="size-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">People Helped</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-orange-100 text-orange-600 rounded-full mb-4">
                <Shield className="size-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Relief Operations</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center size-12 bg-red-100 text-red-600 rounded-full mb-4">
                <Heart className="size-6" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Emergency Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive disaster response services to help communities during their most critical times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="size-6" />
                </div>
                <CardTitle>Search & Rescue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Rapid deployment of trained rescue teams to locate and evacuate people from disaster zones.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="size-6" />
                </div>
                <CardTitle>Medical Aid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Emergency medical services and first aid for injured individuals during disasters.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <HomeIcon className="size-6" />
                </div>
                <CardTitle>Shelter & Housing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Temporary shelter and housing assistance for displaced families and individuals.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="size-6" />
                </div>
                <CardTitle>Relief Supplies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Distribution of food, water, clothing, and essential supplies to affected communities.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/services" className="flex items-center gap-2">
                View All Services
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Disaster Types We Handle */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Disaster Response Coverage</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team is trained and equipped to respond to all types of natural disasters.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: Droplets, name: 'Floods', color: 'bg-blue-100 text-blue-600' },
              { icon: Flame, name: 'Wildfires', color: 'bg-orange-100 text-orange-600' },
              { icon: Wind, name: 'Hurricanes', color: 'bg-purple-100 text-purple-600' },
              { icon: Wind, name: 'Tornadoes', color: 'bg-gray-100 text-gray-600' },
              { icon: AlertCircle, name: 'Earthquakes', color: 'bg-red-100 text-red-600' },
              { icon: Shield, name: 'Other', color: 'bg-green-100 text-green-600' },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className={`size-12 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="size-6" />
                </div>
                <p className="font-medium text-gray-900">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our System Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures rapid response to emergency situations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="size-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit Request</h3>
              <p className="text-gray-600">
                Report your emergency through our online form, phone hotline, or mobile app.
              </p>
            </div>

            <div className="text-center">
              <div className="size-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rapid Assessment</h3>
              <p className="text-gray-600">
                Our team evaluates the situation and assigns priority based on urgency and severity.
              </p>
            </div>

            <div className="text-center">
              <div className="size-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Deploy Resources</h3>
              <p className="text-gray-600">
                Resources and response teams are dispatched immediately to provide assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Emergency Assistance?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our team is standing by 24/7 to respond to disaster emergencies. Don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/submit-request" className="flex items-center gap-2">
                <AlertCircle className="size-5" />
                Submit Emergency Request
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/contact" className="flex items-center gap-2">
                <Phone className="size-5" />
                Call 1-800-DISASTER
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
