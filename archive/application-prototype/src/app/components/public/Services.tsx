import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Shield, 
  Heart, 
  Home, 
  Users, 
  Droplets,
  Flame,
  Wind,
  AlertCircle,
  Package,
  Phone,
  Truck,
  Stethoscope
} from 'lucide-react';

export function Services() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive disaster response and relief services available 24/7 to help communities 
              in their time of greatest need.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1692176961746-e3b5aeb9669a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZW1lcmdlbmN5JTIwcmVzY3VlfGVufDF8fHx8MTc3MjA2MDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical emergency response"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="size-16 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-6">
                <Stethoscope className="size-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Medical Services</h2>
              <p className="text-gray-600 mb-4">
                Our medical teams provide critical care and first aid to injured individuals during and 
                after disasters. We deploy mobile medical units equipped with essential supplies and 
                staffed by experienced healthcare professionals.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Triage and emergency medical assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>On-site first aid and stabilization</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Medical transport coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>Prescription medication assistance</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <div className="size-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="size-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Search & Rescue Operations</h2>
              <p className="text-gray-600 mb-4">
                Our trained search and rescue teams utilize advanced equipment and techniques to locate 
                and evacuate people trapped in disaster zones. We coordinate with local emergency services 
                to ensure efficient operations.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Urban search and rescue in collapsed structures</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Water rescue operations during floods</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Wilderness rescue in remote areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Evacuation coordination and transport</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl order-1 lg:order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBoZWxwaW5nJTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NzIwNjAxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Community volunteers helping"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNhc3RlciUyMHJlbGllZiUyMGh1bWFuaXRhcmlhbiUyMGFpZHxlbnwxfHx8fDE3NzIwNjAxMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Disaster relief supplies"
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="size-16 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <Home className="size-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shelter & Housing Assistance</h2>
              <p className="text-gray-600 mb-4">
                We provide temporary shelter solutions for displaced families and assist with longer-term 
                housing recovery. Our shelters are safe, clean, and equipped with essential amenities.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Emergency shelter setup and management</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Temporary housing placement</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Housing repair and rebuilding assistance</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Rent and utility payment support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Additional Support Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond our core services, we provide comprehensive support to help communities recover and rebuild.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Package className="size-6" />
                </div>
                <CardTitle>Relief Supplies Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Distribution of food, water, clothing, hygiene products, and other essential supplies to affected communities.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Food and water provisions</li>
                  <li>• Hygiene kits and sanitation supplies</li>
                  <li>• Clothing and blankets</li>
                  <li>• Baby supplies and formula</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="size-6" />
                </div>
                <CardTitle>24/7 Emergency Hotline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Round-the-clock emergency support line staffed by trained professionals ready to assist and dispatch resources.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Emergency request intake</li>
                  <li>• Crisis counseling support</li>
                  <li>• Resource coordination</li>
                  <li>• Multilingual support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="size-6" />
                </div>
                <CardTitle>Logistics & Transportation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Coordination of transportation for people, supplies, and equipment to and from disaster areas.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Evacuation transportation</li>
                  <li>• Supply delivery logistics</li>
                  <li>• Equipment transport</li>
                  <li>• Fleet management</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="size-6" />
                </div>
                <CardTitle>Community Support Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Long-term recovery programs to help communities rebuild and become more resilient.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Rebuilding assistance</li>
                  <li>• Financial aid programs</li>
                  <li>• Job placement support</li>
                  <li>• Community counseling</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="size-6" />
                </div>
                <CardTitle>Psychological Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Mental health and emotional support services for disaster survivors and their families.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Crisis counseling</li>
                  <li>• Trauma support groups</li>
                  <li>• Child and family services</li>
                  <li>• Long-term therapy referrals</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="size-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-4">
                  <AlertCircle className="size-6" />
                </div>
                <CardTitle>Disaster Preparedness Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Educational programs to help communities prepare for and respond to future disasters.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Emergency preparedness workshops</li>
                  <li>• First aid training</li>
                  <li>• Evacuation planning</li>
                  <li>• Community resilience programs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disaster Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Disaster Types We Respond To</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our teams are trained and equipped to respond to all types of natural and man-made disasters.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Droplets, name: 'Floods', color: 'bg-blue-100 text-blue-600' },
              { icon: Flame, name: 'Wildfires', color: 'bg-orange-100 text-orange-600' },
              { icon: Wind, name: 'Hurricanes', color: 'bg-purple-100 text-purple-600' },
              { icon: Wind, name: 'Tornadoes', color: 'bg-gray-100 text-gray-600' },
              { icon: AlertCircle, name: 'Earthquakes', color: 'bg-red-100 text-red-600' },
              { icon: Shield, name: 'Other Emergencies', color: 'bg-green-100 text-green-600' },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`size-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="size-8" />
                  </div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Our Services?</h2>
          <p className="text-xl text-blue-100 mb-8">
            If you or someone you know needs disaster relief assistance, don't hesitate to reach out. 
            We're here to help 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:1-800-DISASTER"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              <Phone className="size-5" />
              Call 1-800-DISASTER
            </a>
            <a
              href="/submit-request"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              <AlertCircle className="size-5" />
              Submit Request Online
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
